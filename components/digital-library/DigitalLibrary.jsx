"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Upload as UploadIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  AlertCircle,
  Book,
  X,
  BarChart3,
  List,
  Hash,
  CornerDownRight,
  Bookmark,
  Plus,
  Trash2,
  Edit,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import {
  Input,
  Select,
  Upload as AntUpload,
  message,
  Modal,
  Form,
  Tooltip,
} from "antd";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import Button from "../atoms/Button";
import PageLayout from "../layout/PageLayout";
import DocumentCard from "./DocumentCard";
import { useDispatch, useSelector } from "react-redux";
import { handleGetModuleUnits } from "../../features/modulesSlice";
import {
  handleCreateEbook,
  handleGetAllEbooks,
  handleEditEBook,
  handleDeleteEbook,
} from "../../features/ebookSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { conifgs } from "../../config";

const { Option } = Select;
const { TextArea } = Input;

/* ================= API CONFIG ================ */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3120/api";
const makeURL = (p) =>
  !p
    ? ""
    : /^https?:\/\//i.test(p)
    ? p
    : `${API_BASE.replace(/\/api$/, "")}${p.startsWith("/") ? p : `/${p}`}`;

export default function DigitalLibrary({ id, subject, unit, topic }) {
  const dispatch = useDispatch();
  const { module_units } = useSelector((state) => state?.modules);
  const {
    ebook_list,
    create_ebook_loading,
    delete_ebook_loading,
    edit_ebook_loading,
  } = useSelector((state) => state?.ebooks);

  /* --------- viewer & ui state ---------- */
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const currentDoc = useMemo(
    () => documents.find((d) => d.id === selectedDocId) || null,
    [documents, selectedDocId]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(200);
  const [searchTerm, setSearchTerm] = useState("");

  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [pdfSearchTerm, setPdfSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedText, setSelectedText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const [showPageIndex, setShowPageIndex] = useState(false);
  const [pageOutlines, setPageOutlines] = useState([]);
  const [goToPageValue, setGoToPageValue] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  // create modal
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadForm] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedPDF, setUploadedPDF] = useState(null);

  const [previewTotalPages, setPreviewTotalPages] = useState(0);
  const [previewOutlines, setPreviewOutlines] = useState([]);
  const [customIndex, setCustomIndex] = useState([]);
  const [newIndexEntry, setNewIndexEntry] = useState({
    title: "",
    page: "",
    order: 0,
  });
  const [showCustomIndexForm, setShowCustomIndexForm] = useState(false);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [editingDoc, setEditingDoc] = useState(null);
  const [editPDF, setEditPDF] = useState(null);
  const [editThumb, setEditThumb] = useState(null);

  // delete modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // refs
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const pdfViewerRef = useRef(null);

  /* ---------------- Data fetching ---------------- */
  useEffect(() => {
    if (id) dispatch(handleGetModuleUnits({ id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    dispatch(handleGetAllEbooks({ subject_id: id }))
      .unwrap()
      .catch(() => {});
  }, [dispatch, id]);

  // adapt server list into the left-side list
  useEffect(() => {
    const raw = Array.isArray(ebook_list?.data)
      ? ebook_list.data
      : Array.isArray(ebook_list?.ebooks)
      ? ebook_list.ebooks
      : Array.isArray(ebook_list)
      ? ebook_list
      : [];

    const adapt = (r) => {
      const pdfUrl = r.file ?? r.fileUrl ?? r.file_url ?? r.pdfUrl ?? r.url ?? "";
      const thumb = r.thumbnail ?? r.thumbnail_url ?? r.cover ?? "";
      const derivedFileName = (() => {
        try {
          const u = String(pdfUrl || "");
          return u ? decodeURIComponent(u.split("/").pop() || "") : "";
        } catch {
          return "";
        }
      })();

      // Handle indices from response - they come as 'indecies' array
      const customIndices = Array.isArray(r.indecies)
        ? r.indecies.map((idx) => ({
            id: idx.index_id,
            title: idx.title,
            page: Number(idx.page),
            order: Number(idx.order) || 0,
            type: "custom",
          }))
        : r.custom_indices ?? r.customIndices ?? [];

      return {
        id: r.ebook_id ?? r.id ?? r._id ?? r.book_id ?? Date.now() + Math.random(),
        title: r.book_title ?? r.title ?? "",
        description: r.book_description ?? r.description ?? "",
        author: r.author ?? "",
        status: r.status ?? "active",
        size: r.size
          ? String(r.size).includes("MB")
            ? String(r.size)
            : `${r.size} MB`
          : r.file_size
          ? `${r.file_size} MB`
          : "",
        pages: Number(r.pages) || 0,
        uploadDate: r.created_at
          ? String(r.created_at).slice(0, 10)
          : r.updated_at
          ? String(r.updated_at).slice(0, 10)
          : r.createdAt
          ? String(r.createdAt).slice(0, 10)
          : r.updatedAt
          ? String(r.updatedAt).slice(0, 10)
          : "",
        pdfUrl: makeURL(pdfUrl),
        thumbnail: makeURL(thumb),
        fileName: r.original_name ?? r.file_name ?? derivedFileName,
        customIndices,
      };
    };

    const mapped = raw.map(adapt);
    setDocuments(mapped);
    if (!selectedDocId && mapped.length) setSelectedDocId(mapped[0].id);
  }, [ebook_list, selectedDocId]);

  /* ---------------- PDF.js LOADING ---------------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        if (currentDoc?.pdfUrl) loadPDF(currentDoc.pdfUrl);
      }
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentDoc?.pdfUrl && window.pdfjsLib) {
      loadPDF(currentDoc.pdfUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDoc?.pdfUrl]);

  const loadPDF = async (pdfUrl) => {
    try {
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPdfSearchTerm("");
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      await generatePageOutlines(pdf);
      renderPage(pdf, 1);
    } catch (e) {
      console.error(e);
      message.error("Failed to load PDF.");
    }
  };

  const renderPage = async (pdf, pageNumber) => {
    if (!pdf || !canvasRef.current) return;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: zoom / 100 });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (textLayerRef.current) textLayerRef.current.innerHTML = "";

    await page.render({ canvasContext: ctx, viewport }).promise;

    if (textLayerRef.current && window.pdfjsLib?.TextLayer) {
      const textContent = await page.getTextContent();
      const layer = new window.pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerRef.current,
        viewport,
        enhanceTextSelection: true,
      });
      layer.render();
    }

    if (pdfSearchTerm && searchResults.length > 0) highlightSearchResults();
  };

  useEffect(() => {
    if (pdfDoc) renderPage(pdfDoc, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfDoc, currentPage, zoom]);

  const generatePageOutlines = async (pdf) => {
    try {
      const outline = await pdf.getOutline();
      const out = [];
      if (outline?.length) {
        const walk = (item, level = 0) => {
          out.push({
            title: item.title,
            page: item.dest ? item.dest[0] + 1 : null,
            level,
            type: "outline",
          });
          item.items?.forEach((s) => walk(s, level + 1));
        };
        outline.forEach((i) => walk(i));
      } else {
        for (let i = 1; i <= pdf.numPages; i++) {
          out.push({ title: `Page ${i}`, page: i, level: 0, type: "page" });
        }
      }
      setPageOutlines(out);
    } catch {
      const basic = [];
      for (let i = 1; i <= (pdf?.numPages || 0); i++)
        basic.push({ title: `Page ${i}`, page: i, level: 0, type: "page" });
      setPageOutlines(basic);
    }
  };

  /* -------------- Search / Selection --------------- */
  const handleTextSelection = () => {
    const sel = window.getSelection()?.toString().trim() || "";
    if (sel) setSelectedText(sel);
  };
  const copySelectedText = async () => {
    if (!selectedText) return;
    try {
      await navigator.clipboard.writeText(selectedText);
      setCopySuccess(true);
      message.success("Copied!");
      setTimeout(() => setCopySuccess(false), 1500);
    } catch {
      message.error("Copy failed");
    }
  };

  const searchInPDF = async (term) => {
    if (!pdfDoc || !term.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }
    setIsSearching(true);
    const results = [];
    try {
      for (let p = 1; p <= totalPages; p++) {
        const page = await pdfDoc.getPage(p);
        const text = (await page.getTextContent()).items
          .map((i) => i.str)
          .join(" ")
          .toLowerCase();
        const needle = term.toLowerCase();
        let i = 0;
        while ((i = text.indexOf(needle, i)) !== -1) {
          results.push({ pageNum: p, index: i });
          i += needle.length;
        }
      }
      setSearchResults(results);
      setCurrentSearchIndex(results.length ? 0 : -1);
      if (results[0]?.pageNum && results[0].pageNum !== currentPage)
        setCurrentPage(results[0].pageNum);
      results.length
        ? message.success(`Found ${results.length}`)
        : message.info("No results");
    } finally {
      setIsSearching(false);
    }
  };

  const highlightSearchResults = () => {
    if (!textLayerRef.current || !pdfSearchTerm) return;
    const spans = textLayerRef.current.querySelectorAll("span");
    spans.forEach((el) => {
      const txt = (el.textContent || "").toLowerCase();
      if (txt.includes(pdfSearchTerm.toLowerCase())) {
        el.style.backgroundColor = "#ffeb3b";
      }
    });
  };

  /* -------------- Bookmarks / Index --------------- */
  const toggleBookmark = () => {
    const existing = bookmarks.find((b) => b.page === currentPage);
    if (existing) {
      setBookmarks((b) => b.filter((x) => x.page !== currentPage));
      message.success("Bookmark removed");
    } else {
      setBookmarks((b) =>
        [
          ...b,
          {
            page: currentPage,
            title: `Page ${currentPage}`,
            timestamp: new Date().toISOString(),
          },
        ].sort((a, d) => a.page - d.page)
      );
      message.success("Bookmarked");
    }
  };

  /* -------------- Create: Upload handlers --------------- */
  const handleImageUpload = {
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Image only");
        return false;
      }
      if (file.size / 1024 / 1024 > 5) {
        message.error("Image must be < 5MB");
        return false;
      }
      setUploadedImage({ file, url: URL.createObjectURL(file) });
      return false;
    },
  };

  const handlePDFUpload = {
    beforeUpload: async (file) => {
      if (file.type !== "application/pdf") {
        message.error("PDF only");
        return false;
      }
      if (file.size / 1024 / 1024 > 50) {
        message.error("PDF must be < 50MB");
        return false;
      }
      const url = URL.createObjectURL(file);
      setUploadedPDF({
        file,
        url,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      });

      try {
        if (window.pdfjsLib) {
          const pre = await window.pdfjsLib.getDocument(url).promise;
          setPreviewTotalPages(pre.numPages);
          const outline = await pre.getOutline();
          const outs = [];
          if (outline?.length) {
            const walk = (item, level = 0) => {
              outs.push({
                title: item.title,
                page: item.dest ? item.dest[0] + 1 : null,
                level,
                type: "outline",
              });
              item.items?.forEach((s) => walk(s, level + 1));
            };
            outline.forEach((i) => walk(i));
          }
          setPreviewOutlines(outs);
        }
      } catch {}
      return false;
    },
  };

  /* -------------- CREATE submit (SAFE) --------------- */
  const handleCreate = async (vals) => {
    if (!uploadedPDF?.file) return message.error("Please upload a PDF");
    if (!uploadedImage?.file) return message.error("Please upload a thumbnail");

    const form = new FormData();
    form.append("file", uploadedPDF.file);
    form.append("thumbnail", uploadedImage.file);
    form.append("book_title", vals.title);
    form.append("book_description", vals.description);
    form.append("pages", String(previewTotalPages || 0));
    const mb = Math.max(
      1,
      Math.round((uploadedPDF.file.size / 1024 / 1024) * 10) / 10
    );
    form.append("size", String(mb));
    form.append("status", vals.status || "active");
    form.append("author", vals.author || "");
    form.append("subject_id", id);

    if (customIndex.length > 0) {
      customIndex.forEach((item, index) => {
        form.append(`index[${index}][title]`, item.title);
        form.append(`index[${index}][page]`, String(item.page));
        form.append(`index[${index}][order]`, String(item.order || 0));
      });
    }

    try {
      const res = await dispatch(handleCreateEbook({ body: form })).unwrap();

      // ---- ONLY proceed on success ----
      const statusVal = String(res?.status ?? res?.data?.status ?? "").toLowerCase();
      const ok = statusVal === "success" || statusVal === "ok" || statusVal === "true" || statusVal === "1";
      if (!ok) {
        const errMsg =
          res?.message ||
          res?.data?.message ||
          "Create failed. Please fix inputs and try again.";
        message.error(errMsg);
        toast.error(errMsg);
        return; // <-- do not add to UI
      }

      const r = res?.data ?? res ?? {};

      const responseIndices = Array.isArray(r.indecies)
        ? r.indecies.map((idx) => ({
            id: idx.index_id,
            title: idx.title,
            page: Number(idx.page),
            order: Number(idx.order) || 0,
            type: "custom",
          }))
        : customIndex;

      const newItem = {
        id: r.ebook_id ?? r.id ?? r._id ?? Date.now(),
        title: r.book_title ?? vals.title,
        description: r.book_description ?? vals.description,
        author: r.author ?? vals.author ?? "",
        status: r.status ?? vals.status ?? "active",
        size: r.size ? `${r.size} MB` : `${mb} MB`,
        pages: Number(r.pages) || previewTotalPages || 0,
        uploadDate: r.created_at
          ? String(r.created_at).slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        pdfUrl: makeURL(r.file) || uploadedPDF.url,
        thumbnail: makeURL(r.thumbnail) || uploadedImage.url,
        fileName: r.original_name ?? uploadedPDF.file.name,
        customIndices: responseIndices,
      };

      // Update UI ONLY on success
      setDocuments((prev) => [newItem, ...prev]);
      setSelectedDocId(newItem.id);

      uploadForm.resetFields();
      setUploadedImage(null);
      setUploadedPDF(null);
      setPreviewTotalPages(0);
      setPreviewOutlines([]);
      setCustomIndex([]);
      setShowCustomIndexForm(false);
      setNewIndexEntry({ title: "", page: "", order: 0 });
      setUploadModal(false);

      toast.success(res?.message || "Document created");
      // re-fetch from server for consistency
      dispatch(handleGetAllEbooks({ subject_id: id }));
      axios.get(
        (conifgs?.LIVE_BASE_URL || "").toString() + `e-books/list?subject_id=${id}`
      );
    } catch (e) {
      console.error(e);
      // DO NOT mutate local list on error
      message.error("Create failed. Please try again.");
      // keep modal open so user can correct inputs
    }
  };

  /* -------------- UPDATE open/submit --------------- */
  const openEdit = () => {
    if (!currentDoc) return;
    setEditingDoc(currentDoc);
    editForm.setFieldsValue({
      title: currentDoc.title,
      description: currentDoc.description,
      author: currentDoc.author || "",
      status: currentDoc.status || "active",
    });

    setCustomIndex(
      (currentDoc.customIndices || []).map((x) => ({
        ...x,
        _deleted: false,
        _isNew: false,
        _dirty: false,
      }))
    );

    setEditPDF(null);
    setEditThumb(null);
    setEditOpen(true);
  };

  const editPDFUpload = {
    beforeUpload: (file) => {
      if (file.type !== "application/pdf") {
        message.error("PDF only");
        return false;
      }
      setEditPDF({ file, url: URL.createObjectURL(file) });
      return false;
    },
  };
  const editThumbUpload = {
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        message.error("Image only");
        return false;
      }
      setEditThumb({ file, url: URL.createObjectURL(file) });
      return false;
    },
  };

  // Helpers to mutate a single index row (EDIT modal)
  const updateIndexField = (idx, field, value) => {
    setCustomIndex((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value, _dirty: true } : item
      )
    );
  };
  const toggleDeleteIndex = (idx) => {
    setCustomIndex((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, _deleted: !item._deleted, _dirty: true } : item
      )
    );
  };
  const removeIndexRow = (idx) => {
    setCustomIndex((prev) => {
      const item = prev[idx];
      if (item?.id) {
        return prev.map((it, i) =>
          i === idx ? { ...it, _deleted: true, _dirty: true } : it
        );
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  const addIndexRowCreate = () => {
    const title = (newIndexEntry.title || "").trim();
    const pageNum = parseInt(String(newIndexEntry.page), 10);
    const orderNum = parseInt(String(newIndexEntry.order), 10) || 0;

    if (!title) {
      message.error("Index title is required");
      return;
    }
    if (!pageNum || pageNum < 1 || pageNum > (previewTotalPages || 100000)) {
      message.error(
        `Please enter a valid page number between 1 and ${previewTotalPages || 100000}`
      );
      return;
    }
    setCustomIndex((prev) => [
      ...prev,
      { id: null, title, page: pageNum, order: orderNum, type: "custom" },
    ]);
    setNewIndexEntry({ title: "", page: "", order: 0 });
    message.success("Index entry added");
  };

  const addIndexRowEdit = () => {
    const title = (newIndexEntry.title || "").trim();
    const pageNum = parseInt(String(newIndexEntry.page), 10);
    const orderNum = parseInt(String(newIndexEntry.order), 10) || 0;

    if (!title) {
      message.error("Index title is required");
      return;
    }
    if (!pageNum || pageNum < 1 || pageNum > (editingDoc?.pages || 100000)) {
      message.error(
        `Please enter a valid page number between 1 and ${
          editingDoc?.pages || 100000
        }`
      );
      return;
    }
    setCustomIndex((prev) => [
      ...prev,
      {
        id: null,
        title,
        page: pageNum,
        order: orderNum,
        type: "custom",
        _isNew: true,
        _deleted: false,
        _dirty: true,
      },
    ]);
    setNewIndexEntry({ title: "", page: "", order: 0 });
    message.success("Index entry added");
  };

  const handleUpdate = async (vals) => {
    if (!editingDoc) return;

    const form = new FormData();
    form.append("book_title", vals.title);
    form.append("book_description", vals.description);
    form.append("status", vals.status || "active");
    form.append("author", vals.author || "");
    if (editPDF?.file) form.append("file", editPDF.file);
    if (editThumb?.file) form.append("thumbnail", editThumb.file);

    if (customIndex.length > 0) {
      customIndex.forEach((item, i) => {
        if (item.id != null) {
          form.append(`index[${i}][index_id]`, String(item.id));
        }
        form.append(`index[${i}][title]`, item.title);
        form.append(`index[${i}][page]`, String(item.page));
        form.append(`index[${i}][order]`, String(item.order || 0));
        if (item._deleted) form.append(`index[${i}][_delete]`, "1");
      });
    }

    try {
      const res = await dispatch(
        handleEditEBook({ id: editingDoc.id, body: form })
      ).unwrap();

      const statusVal = String(res?.status ?? res?.data?.status ?? "").toLowerCase();
      const ok = statusVal === "success" || statusVal === "ok" || statusVal === "true" || statusVal === "1";
      if (!ok) {
        const errMsg = res?.message || res?.data?.message || "Update failed.";
        message.error(errMsg);
        toast.error(errMsg);
        return;
      }

      const r = res?.data ?? res ?? {};

      const updatedIndices = Array.isArray(r.indecies)
        ? r.indecies.map((idx) => ({
            id: idx.index_id,
            title: idx.title,
            page: Number(idx.page),
            order: Number(idx.order) || 0,
            type: "custom",
          }))
        : customIndex
            .filter((x) => !x._deleted)
            .map((x) => ({
              id: x.id || x.index_id || null,
              title: x.title,
              page: x.page,
              order: x.order || 0,
              type: "custom",
            }));

      const updated = {
        id: r.ebook_id ?? r.id ?? r._id ?? editingDoc.id,
        title: r.book_title ?? vals.title,
        description: r.book_description ?? vals.description,
        author: r.author ?? vals.author,
        status: r.status ?? vals.status,
        pdfUrl: makeURL(r.file) || (editPDF?.url || editingDoc.pdfUrl),
        thumbnail:
          makeURL(r.thumbnail) || (editThumb?.url || editingDoc.thumbnail),
        customIndices: updatedIndices,
      };

      setDocuments((prev) =>
        prev.map((d) => (d.id === editingDoc.id ? { ...d, ...updated } : d))
      );

      setEditOpen(false);
      setCustomIndex([]);
      message.success(res?.message || "Document updated");
    } catch (e) {
      console.error(e);
      message.error("Update failed");
    }
  };

  /* -------------- DELETE --------------- */
  const handleDelete = () => {
    if (!currentDoc) return;

    dispatch(handleDeleteEbook({ id: currentDoc?.id }))
      .unwrap()
      .then((res) => {
        if (res?.status == "success") {
          toast.success(res?.message);
          dispatch(handleGetAllEbooks({ subject_id: id }));
          setOpenDeleteModal(false);

          setDocuments((prev) => prev.filter((d) => d.id !== currentDoc.id));

          const remaining = documents.filter((d) => d.id !== currentDoc.id);
          setSelectedDocId(remaining[0]?.id ?? null);
        } else {
          toast.error(res?.message || "Delete failed");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to delete ebook");
      })
      .finally(() => {
        setOpenDeleteModal(false);
      });
  };

  /* -------------- Derived / UI helpers --------------- */
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: "E-Book", href: "#", current: true },
  ];

  const filteredDocs = useMemo(
    () =>
      documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [documents, searchTerm]
  );

  /* ================= RENDER ================= */
  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#202938]/60 text-lg">
              Organize and manage your teaching ebooks
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentDoc && (
              <>
                <Button onClick={openEdit}>
                  <span className="inline-flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </span>
                </Button>
                <Button onClick={() => setOpenDeleteModal(true)}>
                  <span className="inline-flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </span>
                </Button>
              </>
            )}
            <button
              type="button"
              onClick={() => setUploadModal(true)}
              className="inline-flex gap-2 items-center justify-center font-medium rounded-lg transition-all duration-200 px-6 py-3 bg-[#0F7490] hover:bg-[#0F7490]/90 text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New E-book
            </button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_auto] bg-gray-50">
        {/* Left list */}
        <div className="bg-white border-r border-gray-200 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Digital Library
            </h2>
          </div>

          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="Search documents..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={{
                  id: String(doc.id),
                  title: doc.title,
                  fileName: doc.fileName || "",
                  status: doc.status === "active" ? "Processed" : "Processing",
                  size: doc.size,
                  pages: doc.pages,
                  sections: 0,
                  uploadDate: doc.uploadDate || "",
                  views: 0,
                  pdfUrl: doc.pdfUrl,
                  thumbnail: doc.thumbnail || "",
                  description: doc.description,
                  statusColor: doc.status === "active" ? "green" : "orange",
                  createdBy: doc.author || "",
                  reviewed: {
                    status: null,
                    reviewedAt: null,
                    reviewedBy: null,
                    comment: null,
                  },
                }}
                isSelected={selectedDocId === doc.id}
                onSelect={() => setSelectedDocId(doc.id)}
              />
            ))}
            {!filteredDocs.length && (
              <div className="p-6 text-center text-gray-500">No documents</div>
            )}
          </div>
        </div>

        {/* Right viewer */}
        <div className="flex flex-col relative">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="rounded p-2 hover:bg-gray-100"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <Input
                  value={currentPage}
                  onChange={(e) =>
                    setCurrentPage(Number(e.target.value) || 1)
                  }
                  className="w-12 text-center"
                  size="small"
                />
                <span className="text-sm whitespace-nowrap text-gray-500">
                  of {totalPages || 0}
                </span>
              </div>
              <button
                type="button"
                className="rounded p-2 hover:bg-gray-100"
                disabled={currentPage >= (totalPages || 0)}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages || 0, p + 1))
                }
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                <Input
                  id="goto-page-input"
                  placeholder="Go to page..."
                  value={goToPageValue}
                  onChange={(e) => setGoToPageValue(e.target.value)}
                  onPressEnter={() => {
                    const n = parseInt(goToPageValue, 10);
                    if (n >= 1 && n <= totalPages) setCurrentPage(n);
                    setGoToPageValue("");
                  }}
                  className="w-24"
                  size="small"
                  prefix={<Hash className="w-3 h-3 text-gray-400" />}
                />
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  onClick={() => {
                    const n = parseInt(goToPageValue, 10);
                    if (n >= 1 && n <= totalPages) setCurrentPage(n);
                    setGoToPageValue("");
                  }}
                  disabled={!goToPageValue}
                  title="Go to page"
                >
                  <CornerDownRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                className={`rounded px-3 py-2 text-sm ${
                  showPageIndex ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setShowPageIndex((s) => !s)}
                title="Toggle page index"
              >
                <span className="inline-flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Index
                </span>
              </button>

              <button
                type="button"
                className={`rounded px-3 py-2 text-sm ${
                  bookmarks.find((b) => b.page === currentPage)
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={toggleBookmark}
                title="Bookmark page"
              >
                <span className="inline-flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  onClick={() => setZoom((z) => Math.max(25, z - 25))}
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <Select
                  value={`${zoom}%`}
                  onChange={(v) => setZoom(parseInt(String(v), 10))}
                  className="w-20"
                  size="small"
                >
                  {["25", "50", "75", "100", "125", "150", "200"].map((v) => (
                    <Option key={v} value={v}>
                      {v}%
                    </Option>
                  ))}
                </Select>
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  onClick={() => setZoom((z) => Math.min(200, z + 25))}
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                className="rounded p-2 hover:bg-gray-100"
                onClick={() =>
                  currentDoc?.pdfUrl && window.open(currentDoc.pdfUrl, "_blank")
                }
                title="Open original"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selected Text Bar */}
          {selectedText && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Selected text:
                </span>
                <span className="text-sm text-blue-700 max-w-md truncate">
                  {selectedText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title={copySuccess ? "Copied!" : "Copy text"}>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
                      copySuccess
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={copySelectedText}
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </Tooltip>
                <button
                  type="button"
                  className="rounded p-2 hover:bg-gray-100"
                  onClick={() => setSelectedText("")}
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Viewer */}
          <div
            ref={pdfViewerRef}
            className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center"
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
          >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {pdfDoc ? (
                <div className="relative">
                  <canvas ref={canvasRef} className="max-w-full h-auto block" />
                  <div
                    ref={textLayerRef}
                    className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
                    style={{ fontSize: `${zoom / 100}rem`, lineHeight: 1.0 }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Loading PDF…
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Please wait while the document loads
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Page Index overlay */}
          {showPageIndex && (
            <div
              className="absolute top-0 left-0 z-30 bottom-0 w-full h-full bg-black/50"
              onClick={() => setShowPageIndex(false)}
            >
              <div className="w-80 absolute top-0 left-0 z-40 bottom-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Page Index
                  </h3>
                  <button
                    type="button"
                    className="rounded p-2 hover:bg-gray-100"
                    onClick={() => setShowPageIndex(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search in Index */}
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search in index..."
                    prefix={<Search className="w-3 h-3 text-gray-400" />}
                    size="small"
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {/* Custom Indices (if any) */}
                  {currentDoc?.customIndices?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        CUSTOM INDEX
                      </div>
                      {currentDoc.customIndices
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((item, i) => (
                          <div
                            key={`custom-${i}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              item.page && setCurrentPage(item.page);
                              setShowPageIndex(false);
                            }}
                            className={`flex items-start gap-2 p-2 rounded cursor-pointer mb-1 ${
                              currentPage === item.page
                                ? "bg-blue-100 text-blue-800"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <FileText className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm flex-1">{item.title}</span>
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
                                Page {item.page}
                              </span>
                              {item.order > 0 && (
                                <span className="text-xs text-gray-400 mt-1">
                                  Order: {item.order}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* PDF Outlines */}
                  <div>
                    {currentDoc?.customIndices?.length > 0 && (
                      <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                        DOCUMENT OUTLINE
                      </div>
                    )}
                    {pageOutlines.map((o, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          o.page && setCurrentPage(o.page);
                          setShowPageIndex(false);
                        }}
                        className={`flex items-start gap-2 p-2 rounded cursor-pointer mb-1 ${
                          currentPage === o.page
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-50"
                        }`}
                        style={{ marginLeft: `${o.level * 12}px` }}
                      >
                        <span className="text-xs text-gray-400 mt-1 min-w-[20px]">
                          {o.page}
                        </span>
                        <span
                          className={`text-sm flex-1 ${
                            o.type === "outline" ? "font-medium" : ""
                          }`}
                          title={o.title}
                        >
                          {o.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <Modal
        title="Delete Ebook"
        open={openDeleteModal}
        footer={null}
        onCancel={() => setOpenDeleteModal(false)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900">Are you sure?</h4>
              <p className="text-sm text-red-700">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Ebook to be deleted:</p>
            <p className="font-medium text-[#202938]">{currentDoc?.title}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setOpenDeleteModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={delete_ebook_loading}
            >
              <Trash2 className="w-4 h-4" />
              {delete_ebook_loading ? "Deleting..." : "Delete Ebook"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============ CREATE MODAL ============ */}
      <Modal
        title="Add New Document"
        open={uploadModal}
        onCancel={() => {
          setUploadModal(false);
          uploadForm.resetFields();
          setUploadedImage(null);
          setUploadedPDF(null);
          setPreviewTotalPages(0);
          setPreviewOutlines([]);
          setCustomIndex([]);
          setShowCustomIndexForm(false);
          setNewIndexEntry({ title: "", page: "", order: 0 });
        }}
        footer={null}
        width={900}
      >
        <Form form={uploadForm} layout="vertical" onFinish={handleCreate} className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* left form */}
            <div>
              <Form.Item
                label="Document Title"
                name="title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Medical Anatomy Fundamentals" size="large" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <TextArea rows={4} placeholder="Comprehensive guide to human anatomy…" />
              </Form.Item>

              <Form.Item label="Author" name="author">
                <Input placeholder="e.g., Mohammed Reda" />
              </Form.Item>

              <Form.Item label="Status" name="status" initialValue="active">
                <Select>
                  <Option value="active">active</Option>
                  <Option value="draft">draft</Option>
                  <Option value="inactive">inactive</Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">Pages</div>
                  <div className="mt-1">{previewTotalPages || "—"}</div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium">PDF Size</div>
                  <div className="mt-1">{uploadedPDF?.size || "—"}</div>
                </div>
              </div>
            </div>

            {/* right: uploads & custom index */}
            <div className="border-l border-gray-200 pl-6">
              <Form.Item label="Thumbnail Image" required>
                <AntUpload.Dragger {...handleImageUpload} multiple={false} style={{ height: 120 }}>
                  {uploadedImage ? (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src={uploadedImage.url}
                        alt="Preview"
                        className="h-16 w-12 object-cover rounded"
                      />
                      <div className="ml-2 text-sm text-green-600">Image selected</div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm">Click or drag image here</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </AntUpload.Dragger>
              </Form.Item>

              <Form.Item label="PDF Document" required>
                <AntUpload.Dragger {...handlePDFUpload} multiple={false} style={{ height: 120 }}>
                  {uploadedPDF ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-600 mb-1">
                        {uploadedPDF.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {uploadedPDF.size} •{" "}
                        {previewTotalPages ? `${previewTotalPages} pages` : "Loading…"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">Click or drag PDF here</p>
                      <p className="text-xs text-gray-500">PDF up to 50MB</p>
                    </>
                  )}
                </AntUpload.Dragger>
              </Form.Item>

              {/* Custom Index Management */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Custom Index</h4>
                    <p className="text-xs text-gray-500">Add custom table of contents entries</p>
                  </div>

                  {/* html button to avoid form submit */}
                  <button
                    type="button"
                    onClick={() => setShowCustomIndexForm(!showCustomIndexForm)}
                    className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                    {showCustomIndexForm ? "Hide" : "Add Index"}
                  </button>
                </div>

                {/* Add Index Form */}
                {showCustomIndexForm && (
                  <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Input
                        placeholder="Index title (e.g., Chapter 1: Introduction)"
                        value={newIndexEntry.title}
                        onChange={(e) =>
                          setNewIndexEntry((s) => ({ ...s, title: e.target.value }))
                        }
                        size="small"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Page #"
                          type="number"
                          min={1}
                          max={previewTotalPages}
                          value={newIndexEntry.page}
                          onChange={(e) =>
                            setNewIndexEntry((s) => ({ ...s, page: e.target.value }))
                          }
                          className="w-20"
                          size="small"
                        />
                        <Input
                          placeholder="Order #"
                          type="number"
                          value={newIndexEntry.order}
                          onChange={(e) =>
                            setNewIndexEntry((s) => ({ ...s, order: e.target.value }))
                          }
                          className="w-20"
                          size="small"
                        />
                        {/* html button to avoid form submit */}
                        <button
                          type="button"
                          onClick={addIndexRowCreate}
                          className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Current Custom Indices */}
                {customIndex.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Current Index Entries:
                    </div>
                    <div className="max-h-32 overflow-y-auto border rounded">
                      {customIndex.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="text-sm text-gray-800">{item.title}</div>
                            <div className="text-xs text-gray-500">
                              Page {item.page} • Order: {item.order || 0}
                            </div>
                          </div>
                          {/* html button to avoid form submit */}
                          <button
                            type="button"
                            className="text-red-600 hover:bg-red-50 rounded px-2 py-1"
                            onClick={() =>
                              setCustomIndex((prev) => prev.filter((_, i) => i !== index))
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-generated Outline Preview */}
                {previewOutlines.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Auto-detected Outline:
                    </div>
                    <div className="max-h-24 overflow-y-auto border rounded text-xs p-2 bg-gray-50">
                      {previewOutlines.slice(0, 3).map((outline, index) => (
                        <div
                          key={index}
                          className="truncate"
                          style={{ marginLeft: `${outline.level * 8}px` }}
                          title={outline.title}
                        >
                          {outline.title} (Page {outline.page})
                        </div>
                      ))}
                      {previewOutlines.length > 3 && (
                        <div className="text-gray-500 text-xs mt-1">
                          + {previewOutlines.length - 3} more entries...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setUploadModal(false);
                uploadForm.resetFields();
                setUploadedImage(null);
                setUploadedPDF(null);
                setPreviewTotalPages(0);
                setPreviewOutlines([]);
                setCustomIndex([]);
                setShowCustomIndexForm(false);
                setNewIndexEntry({ title: "", page: "", order: 0 });
              }}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center font-medium rounded-lg px-6 py-3 bg-[#0F7490] hover:bg-[#0F7490]/90 text-white shadow disabled:opacity-50"
              type="submit"
              disabled={create_ebook_loading}
            >
              {create_ebook_loading ? "Creating..." : "Add Document"}
            </button>
          </div>
        </Form>
      </Modal>

      {/* ============ EDIT MODAL ============ */}
      <Modal
        title={`Edit: ${editingDoc?.title || ""}`}
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setCustomIndex([]);
        }}
        footer={null}
        width={980}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left form */}
            <div>
              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item label="Author" name="author">
                  <Input />
                </Form.Item>
                <Form.Item label="Status" name="status" initialValue="active">
                  <Select>
                    <Option value="active">active</Option>
                    <Option value="draft">draft</Option>
                    <Option value="inactive">inactive</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* Right: file uploads & custom index */}
            <div className="border-l border-gray-200 pl-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium mb-1">Replace PDF (optional)</div>
                  <AntUpload.Dragger {...editPDFUpload} multiple={false} style={{ height: 110 }}>
                    {editPDF ? (
                      <div className="py-6 text-green-600">{editPDF.file.name}</div>
                    ) : (
                      <>
                        <UploadIcon className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-500">Drop PDF here to replace</div>
                      </>
                    )}
                  </AntUpload.Dragger>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Replace Thumbnail (optional)</div>
                  <AntUpload.Dragger {...editThumbUpload} multiple={false} style={{ height: 110 }}>
                    {editThumb ? (
                      <div className="flex items-center justify-center h-full">
                        <img
                          src={editThumb.url}
                          className="h-16 w-12 object-cover rounded"
                          alt="Thumbnail preview"
                        />
                        <div className="ml-2 text-sm text-green-600">Selected</div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-500">Drop image here to replace</div>
                      </>
                    )}
                  </AntUpload.Dragger>
                </div>
              </div>

              {/* Custom Index Management in Edit Modal */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Custom Index</h4>
                    <p className="text-xs text-gray-500">
                      Edit, delete, or add table of contents entries
                    </p>
                  </div>

                  {/* html button to avoid form submit */}
                  <button
                    type="button"
                    onClick={() => setShowCustomIndexForm(!showCustomIndexForm)}
                    className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                    {showCustomIndexForm ? "Hide" : "Add Index"}
                  </button>
                </div>

                {/* Add Index Form */}
                {showCustomIndexForm && (
                  <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Input
                        placeholder="Index title"
                        value={newIndexEntry.title}
                        onChange={(e) =>
                          setNewIndexEntry((s) => ({ ...s, title: e.target.value }))
                        }
                        size="small"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Page #"
                          type="number"
                          min={1}
                          max={editingDoc?.pages || 1000}
                          value={newIndexEntry.page}
                          onChange={(e) =>
                            setNewIndexEntry((s) => ({ ...s, page: e.target.value }))
                          }
                          className="w-20"
                          size="small"
                        />
                        <Input
                          placeholder="Order #"
                          type="number"
                          value={newIndexEntry.order}
                          onChange={(e) =>
                            setNewIndexEntry((s) => ({ ...s, order: e.target.value }))
                          }
                          className="w-20"
                          size="small"
                        />
                        {/* html button to avoid form submit */}
                        <button
                          type="button"
                          onClick={addIndexRowEdit}
                          className="inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editable list */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customIndex.length === 0 && (
                    <div className="text-xs text-gray-500">No custom indices yet.</div>
                  )}
                  {customIndex.map((item, i) => (
                    <div
                      key={item.id ?? `row-${i}`}
                      className={`p-2 border rounded-lg ${
                        item._deleted ? "bg-red-50 border-red-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="grid grid-cols-[1fr_90px_90px_110px] gap-2 items-center">
                        <Input
                          value={item.title}
                          disabled={item._deleted}
                          onChange={(e) => updateIndexField(i, "title", e.target.value)}
                          size="small"
                          className={item._deleted ? "line-through" : ""}
                        />
                        <Input
                          value={item.page}
                          disabled={item._deleted}
                          onChange={(e) =>
                            updateIndexField(
                              i,
                              "page",
                              parseInt(e.target.value || "0", 10) || 0
                            )
                          }
                          size="small"
                          type="number"
                          placeholder="Page"
                          className={item._deleted ? "line-through" : ""}
                        />
                        <Input
                          value={item.order}
                          disabled={item._deleted}
                          onChange={(e) =>
                            updateIndexField(
                              i,
                              "order",
                              parseInt(e.target.value || "0", 10) || 0
                            )
                          }
                          size="small"
                          type="number"
                          placeholder="Order"
                          className={item._deleted ? "line-through" : ""}
                        />
                        <div className="flex items-center justify-end gap-2">
                          {!item._deleted ? (
                            <>
                              {/* html button to avoid form submit */}
                              <button
                                type="button"
                                className="text-red-600 hover:bg-red-50 rounded px-2 py-1"
                                onClick={() => toggleDeleteIndex(i)}
                                title="Mark for delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {!item.id && (
                                <button
                                  type="button"
                                  className="rounded px-2 py-1 hover:bg-gray-100 text-sm"
                                  onClick={() => removeIndexRow(i)}
                                  title="Remove row"
                                >
                                  Remove
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                              onClick={() => toggleDeleteIndex(i)}
                              title="Undo delete"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                      {item.id && (
                        <div className="text-[10px] text-gray-400 mt-1">
                          index_id: {item.id}
                          {item._deleted ? " • will be deleted" : ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              onClick={() => {
                setEditOpen(false);
                setCustomIndex([]);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => editForm.submit()}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!!edit_ebook_loading}
            >
              {edit_ebook_loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </Form>
      </Modal>
    </PageLayout>
  );
}
