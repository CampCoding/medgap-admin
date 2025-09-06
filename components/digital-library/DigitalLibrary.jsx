"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
  AlertCircle,
  Book,
  Menu,
  X,
  Calendar,
  Eye,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  BookOpen,
  Users,
  BarChart3,
  Filter,
  List,
  Hash,
  CornerDownRight,
  Bookmark,
  Plus,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import {
  Input,
  Select,
  Dropdown,
  Badge,
  Upload as AntUpload,
  message,
  Modal,
  Form,
  TextArea,
  Tooltip,
  Card,
} from "antd";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import Button from "../atoms/Button";
import PageLayout from "../layout/PageLayout";
import IndexEntryItem from "./IndexEntryItem";
import DocumentCard from "./DocumentCard";

const { Option } = Select;
const { TextArea: AntTextArea } = Input;

const DigitalLibrary = ({ subject, unit, topic }) => {
  // Sample PDF URLs - different PDFs for each document
  const samplePDFs = {
    "medical-anatomy":
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    "physiology-guide":
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    "clinical-procedures":
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    pharmacology:
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
  };

  const [selectedDoc, setSelectedDoc] = useState("medical-anatomy");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(200);
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfSearchTerm, setPdfSearchTerm] = useState("");
  const [pdfDoc, setPdfDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadForm] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedPDF, setUploadedPDF] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [textLayer, setTextLayer] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPageIndex, setShowPageIndex] = useState(false);
  const [pageOutlines, setPageOutlines] = useState([]);
  const [goToPageValue, setGoToPageValue] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  // Modal preview states
  const [previewPDF, setPreviewPDF] = useState(null);
  const [previewCurrentPage, setPreviewCurrentPage] = useState(1);
  const [previewTotalPages, setPreviewTotalPages] = useState(0);
  const [previewOutlines, setPreviewOutlines] = useState([]);
  const [previewGoToPage, setPreviewGoToPage] = useState("");
  const [showPreviewIndex, setShowPreviewIndex] = useState(false);

  // Custom indexing states
  const [customIndex, setCustomIndex] = useState([]);
  const [showCustomIndexForm, setShowCustomIndexForm] = useState(false);
  const [newIndexEntry, setNewIndexEntry] = useState({
    title: "",
    page: "",
    level: 0,
  });

  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const containerRef = useRef(null);
  const topbarRef = useRef(null);
  const pdfViewerRef = useRef(null);

  // Modal preview refs
  const previewCanvasRef = useRef(null);
  const previewContainerRef = useRef(null);

  const [documents, setDocuments] = useState([
    {
      id: "medical-anatomy",
      title: "Medical Anatomy Fundamentals",
      fileName: "medical-anatomy-fundamentals.pdf",
      status: "Processed",
      statusColor: "green",
      size: "15 MB",
      pages: 245,
      sections: 12,
      uploadDate: "2024-01-15",
      views: 1240,
      pdfUrl: samplePDFs["medical-anatomy"],
      thumbnail:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=200&fit=crop&crop=center",
      description:
        "Comprehensive guide to human anatomy with detailed illustrations and explanations.",
      createdBy: "Dr. Alice Smith",
      reviewed: {
        status: "accepted", // "accepted", "rejected", or null
        reviewedBy: "Prof. John Doe",
        reviewedAt: "2024-01-18",
        comment: "Meets all requirements."
      }
    },
    {
      id: "physiology-guide",
      title: "Physiology Study Guide",
      fileName: "physiology-study-guide.pdf",
      status: "Processing",
      statusColor: "orange",
      size: "8.5 MB",
      pages: 156,
      sections: 8,
      uploadDate: "2024-01-20",
      views: 892,
      pdfUrl: samplePDFs["physiology-guide"],
      thumbnail:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=150&h=200&fit=crop&crop=center",
      description:
        "Essential physiology concepts for medical students and professionals.",
      createdBy: "Dr. Emily Brown",
      reviewed: {
        status: null, // Not yet reviewed
        reviewedBy: null,
        reviewedAt: null,
        comment: null
      }
    },
    {
      id: "clinical-procedures",
      title: "Clinical Procedures Manual",
      fileName: "clinical-procedures-manual.pdf",
      status: "Processed",
      statusColor: "green",
      size: "21 MB",
      pages: 389,
      sections: 25,
      uploadDate: "2024-01-10",
      views: 2156,
      pdfUrl: samplePDFs["clinical-procedures"],
      thumbnail:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=200&fit=crop&crop=center",
      description:
        "Step-by-step clinical procedures with safety guidelines and best practices.",
      createdBy: "Dr. Michael Lee",
      reviewed: {
        status: "rejected",
        reviewedBy: "Prof. Sarah White",
        reviewedAt: "2024-01-12",
        comment: "Missing some safety guidelines."
      }
    },
    {
      id: "pharmacology",
      title: "Pharmacology Reference",
      fileName: "pharmacology-reference.pdf",
      status: "Processed",
      statusColor: "green",
      size: "12 MB",
      pages: 198,
      sections: 15,
      uploadDate: "2024-01-25",
      views: 567,
      pdfUrl: samplePDFs["pharmacology"],
      thumbnail:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&h=200&fit=crop&crop=center",
      description:
        "Complete pharmacology reference with drug interactions and dosage guidelines.",
      createdBy: "Dr. Olivia Green",
      reviewed: {
        status: "accepted",
        reviewedBy: "Prof. John Doe",
        reviewedAt: "2024-01-27",
        comment: "Excellent reference material."
      }
    },
  ]);

  const currentDoc = documents.find((doc) => doc.id === selectedDoc);

  // Keyboard navigation handler
  const handleKeyboardNavigation = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();

      setCurrentPage(Math.max(1, currentPage - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentPage(Math.min(totalPages, currentPage + 1));
    }
  };

  // Load PDF.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        // Load the first document by default
        if (currentDoc?.pdfUrl) {
          loadPDF(currentDoc.pdfUrl);
        }
      }
    };
    document.head.appendChild(script);

    // Add keyboard event listeners
    const handleKeyDown = (e) => handleKeyboardShortcuts(e);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (currentDoc?.pdfUrl && window.pdfjsLib) {
      loadPDF(currentDoc.pdfUrl);
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === selectedDoc ? { ...doc, views: doc.views + 1 } : doc
        )
      );
    }
  }, [selectedDoc]);

  // Load and render PDF
  const loadPDF = async (pdfUrl) => {
    if (!window.pdfjsLib) {
      message.error("PDF.js is not loaded yet. Please try again.");
      return;
    }

    try {
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPdfSearchTerm("");
      setSearchResults([]);
      setCurrentSearchIndex(-1);

      // Generate page outlines/index
      await generatePageOutlines(pdf);

      renderPage(pdf, 1);
    } catch (error) {
      console.error("Error loading PDF:", error);
      message.error("Error loading PDF file");
    }
  };

  // Generate page outlines for indexing
  const generatePageOutlines = async (pdf) => {
    try {
      const outlines = [];

      // Try to get PDF outlines if available
      const outline = await pdf.getOutline();
      if (outline && outline.length > 0) {
        const processOutlineItem = (item, level = 0) => {
          outlines.push({
            title: item.title,
            page: item.dest ? item.dest[0] + 1 : null,
            level: level,
            type: "outline",
          });

          if (item.items && item.items.length > 0) {
            item.items.forEach((subItem) =>
              processOutlineItem(subItem, level + 1)
            );
          }
        };

        outline.forEach((item) => processOutlineItem(item));
      } else {
        // Generate basic page index if no outlines exist
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Try to find headings or important text on the page
            const pageText = textContent.items
              .filter((item) => item.str.trim().length > 3)
              .slice(0, 3) // Get first 3 text items as potential headings
              .map((item) => item.str.trim())
              .join(" ");

            outlines.push({
              title:
                pageText.length > 50
                  ? pageText.substring(0, 50) + "..."
                  : pageText || `Page ${i}`,
              page: i,
              level: 0,
              type: "page",
            });
          } catch (error) {
            // Fallback for pages that can't be processed
            outlines.push({
              title: `Page ${i}`,
              page: i,
              level: 0,
              type: "page",
            });
          }
        }
      }

      setPageOutlines(outlines);
    } catch (error) {
      console.error("Error generating page outlines:", error);
      // Create basic page list as fallback
      const basicOutlines = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        basicOutlines.push({
          title: `Page ${i}`,
          page: i,
          level: 0,
          type: "page",
        });
      }
      setPageOutlines(basicOutlines);
    }
  };

  // Handle go to page
  const handleGoToPage = (pageNumber) => {
    const page = parseInt(pageNumber);
    if (page && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageValue("");
      message.success(`Navigated to page ${page}`);
    } else {
      message.error(
        `Please enter a valid page number between 1 and ${totalPages}`
      );
    }
  };

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = (e) => {
    // Ctrl+G for go to page
    if (e.ctrlKey && e.key === "g") {
      e.preventDefault();
      const pageInput = document.getElementById("goto-page-input");
      if (pageInput) {
        pageInput.focus();
        pageInput.select();
      }
    }

    // Ctrl+I for toggle index
    if (e.ctrlKey && e.key === "i") {
      e.preventDefault();
      setShowPageIndex(!showPageIndex);
    }

    // Handle regular navigation
    handleKeyboardNavigation(e);
  };

  // Add/remove bookmark
  const toggleBookmark = () => {
    const existingBookmark = bookmarks.find((b) => b.page === currentPage);

    if (existingBookmark) {
      setBookmarks(bookmarks.filter((b) => b.page !== currentPage));
      message.success("Bookmark removed");
    } else {
      const newBookmark = {
        page: currentPage,
        title: `Page ${currentPage}`,
        timestamp: new Date().toISOString(),
      };
      setBookmarks([...bookmarks, newBookmark].sort((a, b) => a.page - b.page));
      message.success("Page bookmarked");
    }
  };

  // Load PDF for preview in modal
  const loadPreviewPDF = async (pdfUrl) => {
    if (!window.pdfjsLib) {
      message.error("PDF.js is not loaded yet. Please try again.");
      return;
    }

    try {
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPreviewPDF(pdf);
      setPreviewTotalPages(pdf.numPages);
      setPreviewCurrentPage(1);

      // Generate preview outlines
      await generatePreviewOutlines(pdf);

      message.success(`PDF loaded successfully! ${pdf.numPages} pages found.`);
    } catch (error) {
      console.error("Error loading preview PDF:", error);
      message.error("Error loading PDF file for preview");
    }
  };

  // Generate outlines for preview
  const generatePreviewOutlines = async (pdf) => {
    try {
      const outlines = [];

      // Try to get PDF outlines if available
      const outline = await pdf.getOutline();
      if (outline && outline.length > 0) {
        const processOutlineItem = (item, level = 0) => {
          outlines.push({
            title: item.title,
            page: item.dest ? item.dest[0] + 1 : null,
            level: level,
            type: "outline",
          });

          if (item.items && item.items.length > 0) {
            item.items.forEach((subItem) =>
              processOutlineItem(subItem, level + 1)
            );
          }
        };

        outline.forEach((item) => processOutlineItem(item));
      } else {
        // Generate basic page index for first 10 pages (for performance)
        const maxPages = Math.min(pdf.numPages, 10);
        for (let i = 1; i <= maxPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Try to find headings or important text on the page
            const pageText = textContent.items
              .filter((item) => item.str.trim().length > 3)
              .slice(0, 2) // Get first 2 text items as potential headings
              .map((item) => item.str.trim())
              .join(" ");

            outlines.push({
              title:
                pageText.length > 40
                  ? pageText.substring(0, 40) + "..."
                  : pageText || `Page ${i}`,
              page: i,
              level: 0,
              type: "page",
            });
          } catch (error) {
            // Fallback for pages that can't be processed
            outlines.push({
              title: `Page ${i}`,
              page: i,
              level: 0,
              type: "page",
            });
          }
        }

        // Add remaining pages without text analysis
        if (pdf.numPages > 10) {
          for (let i = 11; i <= pdf.numPages; i++) {
            outlines.push({
              title: `Page ${i}`,
              page: i,
              level: 0,
              type: "page",
            });
          }
        }
      }

      setPreviewOutlines(outlines);
    } catch (error) {
      console.error("Error generating preview outlines:", error);
      // Create basic page list as fallback
      const basicOutlines = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        basicOutlines.push({
          title: `Page ${i}`,
          page: i,
          level: 0,
          type: "page",
        });
      }
      setPreviewOutlines(basicOutlines);
    }
  };

  // Custom indexing functions
  const addIndexEntry = () => {
    const { title, page, level } = newIndexEntry;

    if (!title.trim()) {
      message.error("Please enter a title for the index entry");
      return;
    }

    const pageNum = parseInt(page);
    if (!pageNum || pageNum < 1) {
      message.error("Please enter a valid page number (1 or greater)");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: title.trim(),
      page: pageNum,
      level: level,
      type: "custom",
    };

    const updatedIndex = [...customIndex, newEntry].sort(
      (a, b) => a.page - b.page
    );
    setCustomIndex(updatedIndex);
    setNewIndexEntry({ title: "", page: "", level: 0 });
    message.success("Index entry added successfully");
  };

  const deleteIndexEntry = (id) => {
    setCustomIndex(customIndex.filter((entry) => entry.id !== id));
    message.success("Index entry removed");
  };

  const editIndexEntry = (id, updatedEntry) => {
    const pageNum = parseInt(updatedEntry.page);
    if (!updatedEntry.title.trim()) {
      message.error("Please enter a title for the index entry");
      return;
    }

    if (!pageNum || pageNum < 1) {
      message.error("Please enter a valid page number (1 or greater)");
      return;
    }

    const updatedIndex = customIndex
      .map((entry) =>
        entry.id === id
          ? {
              ...entry,
              title: updatedEntry.title.trim(),
              page: pageNum,
              level: updatedEntry.level,
            }
          : entry
      )
      .sort((a, b) => a.page - b.page);

    setCustomIndex(updatedIndex);
    message.success("Index entry updated");
  };

  const goToIndexPage = (pageNumber) => {
    // Placeholder function for index navigation (preview removed)
    message.info(`Index entry for page ${pageNumber}`);
  };

  const importAutoIndex = (e) => {
    e.preventDefault();

    if (previewOutlines.length > 0) {
      const importedEntries = previewOutlines.map((outline, index) => ({
        id: Date.now() + index,
        title: outline.title,
        page: outline.page,
        level: outline.level,
        type: "imported",
      }));

      setCustomIndex(importedEntries);
      message.success(
        `Imported ${importedEntries.length} index entries from PDF`
      );
    } else {
      message.info("No automatic index found in PDF to import");
    }
  };

  // Render specific page with text layer
  const renderPage = async (pdf, pageNumber) => {
    if (!pdf || !canvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: zoom / 100 });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Clear previous text layer
      if (textLayerRef.current) {
        textLayerRef.current.innerHTML = "";
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Render the page
      await page.render(renderContext).promise;

      // Add text layer for selection and search
      if (textLayerRef.current) {
        const textContent = await page.getTextContent();
        setTextLayer(textContent);

        // Create text layer div
        textLayerRef.current.style.position = "absolute";
        textLayerRef.current.style.left = "0";
        textLayerRef.current.style.top = "0";
        textLayerRef.current.style.right = "0";
        textLayerRef.current.style.bottom = "0";
        textLayerRef.current.style.overflow = "hidden";
        textLayerRef.current.style.opacity = "0.2";
        textLayerRef.current.style.lineHeight = "1.0";

        // Render text items
        const textLayer = new window.pdfjsLib.TextLayer({
          textContentSource: textContent,
          container: textLayerRef.current,
          viewport: viewport,
          enhanceTextSelection: true,
        });

        textLayer.render();
      }

      // Highlight search results if any
      if (pdfSearchTerm && searchResults.length > 0) {
        highlightSearchResults();
      }
    } catch (error) {
      console.error("Error rendering page:", error);
    }
  };

  // Search in PDF
  const searchInPDF = async (searchTerm) => {
    if (!pdfDoc || !searchTerm.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
      return;
    }

    setIsSearching(true);
    const results = [];

    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ")
          .toLowerCase();

        const searchTermLower = searchTerm.toLowerCase();
        let index = 0;

        while ((index = pageText.indexOf(searchTermLower, index)) !== -1) {
          results.push({
            pageNum,
            index,
            text: pageText.substr(Math.max(0, index - 50), 100),
          });
          index += searchTermLower.length;
        }
      }

      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);

      if (results.length > 0) {
        // Go to first result
        if (results[0].pageNum !== currentPage) {
          setCurrentPage(results[0].pageNum);
        }
        message.success(`Found ${results.length} results`);
      } else {
        message.info("No results found");
      }
    } catch (error) {
      console.error("Search error:", error);
      message.error("Error searching PDF");
    } finally {
      setIsSearching(false);
    }
  };

  // Highlight search results on current page
  const highlightSearchResults = () => {
    if (!textLayerRef.current || !pdfSearchTerm) return;

    const textElements = textLayerRef.current.querySelectorAll("span");
    textElements.forEach((element) => {
      const text = element.textContent.toLowerCase();
      const searchTerm = pdfSearchTerm.toLowerCase();

      if (text.includes(searchTerm)) {
        element.style.backgroundColor = "#ffeb3b";
        element.style.color = "#000";
      }
    });
  };

  // Navigate search results
  const navigateSearchResult = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex = currentSearchIndex;
    if (direction === "next") {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex =
        currentSearchIndex <= 0
          ? searchResults.length - 1
          : currentSearchIndex - 1;
    }

    setCurrentSearchIndex(newIndex);
    const result = searchResults[newIndex];

    if (result.pageNum !== currentPage) {
      setCurrentPage(result.pageNum);
    }
  };

  // Handle page change
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage);
    }
  }, [pdfDoc, currentPage, zoom]);

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);
    }
  };

  // Copy selected text
  const copySelectedText = () => {
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          setCopySuccess(true);
          message.success("Text copied to clipboard!");
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(() => {
          message.error("Failed to copy text");
        });
    }
  };

  // Handle document selection
  const handleDocumentSelect = (docId) => {
    setSelectedDoc(docId);
    setCurrentPage(1);
    setPdfSearchTerm("");
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setSelectedText("");
  };

  // Handle image upload for thumbnail
  const handleImageUpload = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      const imageUrl = URL.createObjectURL(file);
      setUploadedImage({
        file,
        url: imageUrl,
      });

      return false;
    },
  };

  // Handle PDF upload
  const handlePDFUpload = {
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("You can only upload PDF files!");
        return false;
      }

      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("PDF must be smaller than 50MB!");
        return false;
      }

      const pdfUrl = URL.createObjectURL(file);
      setUploadedPDF({
        file,
        url: pdfUrl,
        size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      });

      // Load PDF for preview in modal
      loadPreviewPDF(pdfUrl);

      return false;
    },
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    if (!uploadedImage) {
      message.error("Please upload a thumbnail image!");
      return;
    }

    if (!uploadedPDF) {
      message.error("Please upload a PDF file!");
      return;
    }

    try {
      const newDoc = {
        id: `doc-${Date.now()}`,
        title: values.title,
        fileName: uploadedPDF.file.name,
        status: "Processing",
        statusColor: "orange",
        size: uploadedPDF.size,
        pages: previewTotalPages,
        sections: customIndex.length,
        uploadDate: new Date().toISOString().split("T")[0],
        views: 0,
        pdfUrl: uploadedPDF.url,
        thumbnail: uploadedImage.url,
        description: values.description,
        customIndex: customIndex, // Store the custom index
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc.id);
      loadPDF(uploadedPDF.url);

      uploadForm.resetFields();
      setUploadedImage(null);
      setUploadedPDF(null);
      setUploadModal(false);

      // Reset custom index states
      setCustomIndex([]);
      setNewIndexEntry({ title: "", page: "", level: 0 });
      setShowCustomIndexForm(false);

      message.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload document");
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: subject?.name, href: "#" },
    { label: unit?.name, href: "#" },
    { label: topic?.name, href: "#" },
    { label: "Digital Library", href: "#", current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="">
            <h1 className="text-4xl font-bold text-[#202938] mb-2">
              Topic: {topic?.name}
            </h1>
            <p className="text-[#202938]/60 text-lg">
              Organize and manage your teaching modules
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setUploadModal(true)}
              className="inline-flex gap-2 items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-base bg-[#0F7490] hover:bg-[#0F7490]/90 text-white focus:ring-[#0F7490]/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 "
            >
              <Plus className="w-5 h-5" />
              Add New Digital Library
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_auto]   bg-gray-50">
        {/* Left Sidebar */}
        <div className=" bg-white border-r border-gray-200 flex flex-col">
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
            {documents
              .filter(
                (doc) =>
                  doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  doc.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  isSelected={selectedDoc === doc.id}
                  onSelect={handleDocumentSelect}
                />
              ))}
          </div>
        </div>

        {/* Main Content */}
        <div className=" flex flex-col relative">
          {/* Page Index Sidebar */}
          {showPageIndex && (
            <div
              onClick={() => setShowPageIndex(false)}
              className="absolute top-0 left-0 z-30 bottom-0 w-full h-full bg-black/50"
            >
              <div
                className={`w-80 absolute top-0 left-0 z-30 bottom-0 bg-white border-r border-gray-200 flex flex-col ${
                  showPageIndex ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Page Index
                  </h3>
                  <Button
                    type="text"
                    icon={<X className="w-4 h-4" />}
                    onClick={() => setShowPageIndex(false)}
                    size="small"
                  />
                </div>

                {/* Bookmarks Section */}
                {bookmarks.length > 0 && (
                  <div className="border-b border-gray-200">
                    <div className="p-3 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Bookmarks
                      </h4>
                      {bookmarks.map((bookmark) => (
                        <div
                          key={bookmark.page}
                          onClick={() => setCurrentPage(bookmark.page)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors mb-1 ${
                            currentPage === bookmark.page
                              ? "bg-blue-100 text-blue-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-sm">{bookmark.title}</span>
                          <span className="text-xs text-gray-500">
                            p.{bookmark.page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Outlines */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2">
                    {pageOutlines.map((outline, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          outline.page && setCurrentPage(outline.page)
                        }
                        className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors mb-1 ${
                          currentPage === outline.page
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-50"
                        }`}
                        style={{ marginLeft: `${outline.level * 12}px` }}
                      >
                        <span className="text-xs text-gray-400 mt-1 min-w-[20px]">
                          {outline.page}
                        </span>
                        <span
                          className={`text-sm flex-1 ${
                            outline.type === "outline" ? "font-medium" : ""
                          }`}
                          title={outline.title}
                        >
                          {outline.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-600 mb-2">
                    Keyboard shortcuts:
                  </div>
                  <div className="text-xs space-y-1 text-gray-500">
                    <div>Ctrl+G - Go to page</div>
                    <div>Ctrl+I - Toggle index</div>
                    <div>← → - Navigate pages</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Toolbar - Now focusable and handles keyboard navigation */}
          <div
            ref={topbarRef}
            className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between focus:outline-none  "
            tabIndex={0}
            onKeyDown={handleKeyboardNavigation}
            title="Use ← → arrow keys to navigate pages"
          >
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<ChevronLeft className="w-4 h-4" />}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              />
              <div className="flex items-center gap-2">
                <Input
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                  className="w-12 text-center"
                  size="small"
                />
                <span className="text-sm whitespace-nowrap text-gray-500">
                  of {totalPages || 0}
                </span>
              </div>
              <Button
                type="text"
                icon={<ChevronRight className="w-4 h-4" />}
                disabled={currentPage >= (totalPages || 0)}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages || 0, currentPage + 1))
                }
              />

              {/* Go to Page */}
              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                <Input
                  id="goto-page-input"
                  placeholder="Go to page..."
                  value={goToPageValue}
                  onChange={(e) => setGoToPageValue(e.target.value)}
                  onPressEnter={() => handleGoToPage(goToPageValue)}
                  className="w-24"
                  size="small"
                  prefix={<Hash className="w-3 h-3 text-gray-400" />}
                />
                <Button
                  type="text"
                  icon={<CornerDownRight className="w-4 h-4" />}
                  onClick={() => handleGoToPage(goToPageValue)}
                  disabled={!goToPageValue}
                  title="Go to page (Ctrl+G)"
                />
              </div>

              {/* Page Index Toggle */}
              <Button
                type={showPageIndex ? "primary" : "text"}
                icon={<List className="w-4 h-4" />}
                onClick={() => setShowPageIndex(!showPageIndex)}
                title="Toggle page index (Ctrl+I)"
              />

              {/* Bookmark current page */}
              <Button
                type={
                  bookmarks.find((b) => b.page === currentPage)
                    ? "primary"
                    : "text"
                }
                icon={<Bookmark className="w-4 h-4" />}
                onClick={toggleBookmark}
                title={
                  bookmarks.find((b) => b.page === currentPage)
                    ? "Remove bookmark"
                    : "Bookmark this page"
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  type="text"
                  icon={<ZoomOut className="w-4 h-4" />}
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                />
                <Select
                  value={`${zoom}%`}
                  onChange={(value) => setZoom(parseInt(value))}
                  className="w-20"
                  size="small"
                >
                  <Option value="25">25%</Option>
                  <Option value="50">50%</Option>
                  <Option value="75">75%</Option>
                  <Option value="100">100%</Option>
                  <Option value="125">125%</Option>
                  <Option value="150">150%</Option>
                  <Option value="200">200%</Option>
                </Select>
                <Button
                  type="text"
                  icon={<ZoomIn className="w-4 h-4" />}
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                />
              </div>

              <Button
                type="text"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  if (currentDoc?.pdfUrl) {
                    window.open(currentDoc.pdfUrl, "_blank");
                  }
                }}
              />
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
                  <Button
                    size="small"
                    type={copySuccess ? "primary" : "default"}
                    icon={
                      copySuccess ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )
                    }
                    onClick={copySelectedText}
                  >
                    {copySuccess ? "Copied" : "Copy"}
                  </Button>
                </Tooltip>
                <Button
                  size="small"
                  type="text"
                  icon={<X className="w-4 h-4" />}
                  onClick={() => setSelectedText("")}
                />
              </div>
            </div>
          )}

          {/* PDF Content Area - Now focusable and handles keyboard navigation */}
          <div
            ref={pdfViewerRef}
            className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center focus:outline-none "
            tabIndex={0}
            onKeyDown={handleKeyboardNavigation}
            title="Click here and use ← → arrow keys to navigate pages"
          >
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              ref={containerRef}
            >
              {pdfDoc ? (
                <div
                  className="relative"
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                >
                  <canvas ref={canvasRef} className="max-w-full h-auto block" />
                  <div
                    ref={textLayerRef}
                    className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
                    style={{
                      fontSize: `${zoom / 100}rem`,
                      lineHeight: 1.0,
                    }}
                  />
                </div>
              ) : (
                <div className="w-full max-w-4xl mx-auto p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Loading PDF...
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Please wait while the document loads
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        <Modal
          title="Add New Document to Digital Library"
          open={uploadModal}
          onCancel={() => {
            setUploadModal(false);
            uploadForm.resetFields();
            setUploadedImage(null);
            setUploadedPDF(null);
            // Reset preview states
            setPreviewPDF(null);
            setPreviewCurrentPage(1);
            setPreviewTotalPages(0);
            setPreviewOutlines([]);
            setPreviewGoToPage("");
            setShowPreviewIndex(false);
            // Reset custom index states
            setCustomIndex([]);
            setNewIndexEntry({ title: "", page: "", level: 0 });
            setShowCustomIndexForm(false);
          }}
          footer={null}
          width={900}
        >
          <Form
            form={uploadForm}
            layout="vertical"
            onFinish={handleFormSubmit}
            className="py-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div>
                <Form.Item
                  label="Document Title"
                  name="title"
                  rules={[
                    { required: true, message: "Please enter document title!" },
                  ]}
                >
                  <Input placeholder="Enter document title" size="large" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Please enter description!" },
                  ]}
                >
                  <AntTextArea
                    rows={4}
                    placeholder="Enter document description"
                  />
                </Form.Item>

                <Form.Item label="Thumbnail Image" required>
                  <AntUpload.Dragger
                    {...handleImageUpload}
                    multiple={false}
                    className="upload-area"
                    style={{ height: "120px" }}
                  >
                    {uploadedImage ? (
                      <div className="flex items-center justify-center h-full">
                        <img
                          src={uploadedImage.url}
                          alt="Preview"
                          className="h-16 w-12 object-cover rounded"
                        />
                        <div className="ml-2 text-sm text-green-600">
                          Image selected
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm">Click or drag image here</p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </AntUpload.Dragger>
                </Form.Item>

                <Form.Item label="PDF Document" required>
                  <AntUpload.Dragger
                    {...handlePDFUpload}
                    multiple={false}
                    className="upload-area"
                    style={{ height: "120px" }}
                  >
                    {uploadedPDF ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileText className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-sm font-medium text-green-600 mb-1">
                          {uploadedPDF.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {uploadedPDF.size} •{" "}
                          {previewTotalPages > 0
                            ? `${previewTotalPages} pages`
                            : "Loading..."}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          Click or drag PDF file here
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF files up to 50MB
                        </p>
                      </>
                    )}
                  </AntUpload.Dragger>
                </Form.Item>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Requirements:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• PDF format only, max 50MB</li>
                    <li>• Thumbnail image (PNG/JPG, max 5MB)</li>
                    <li>• Descriptive title and summary</li>
                    <li>• Document will be processed for search</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Custom Page Index */}
              <div className="border-l border-gray-200 pl-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Page Index</h4>
                  <div className="flex items-center gap-2">
                    {previewOutlines.length > 0 && (
                      <Button
                        type="default"
                        icon={<FileText className="w-3 h-3" />}
                        onClick={importAutoIndex}
                        size="small"
                        title="Import PDF index"
                      >
                        Import
                      </Button>
                    )}
                    <Button
                      type={showCustomIndexForm ? "primary" : "default"}
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() =>
                        setShowCustomIndexForm(!showCustomIndexForm)
                      }
                      size="small"
                    >
                      {showCustomIndexForm ? "Close" : "Add"}
                    </Button>
                  </div>
                </div>

                {/* Add Index Entry Form */}
                {showCustomIndexForm && (
                  <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="space-y-3">
                      <Input
                        placeholder="Index title (e.g., Introduction, Chapter 1)"
                        value={newIndexEntry.title}
                        onChange={(e) =>
                          setNewIndexEntry({
                            ...newIndexEntry,
                            title: e.target.value,
                          })
                        }
                        size="small"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Page #"
                          type="number"
                          min="1"
                          value={newIndexEntry.page}
                          onChange={(e) =>
                            setNewIndexEntry({
                              ...newIndexEntry,
                              page: e.target.value,
                            })
                          }
                          className="w-20"
                          size="small"
                        />
                        <Select
                          value={newIndexEntry.level}
                          onChange={(value) =>
                            setNewIndexEntry({ ...newIndexEntry, level: value })
                          }
                          className="w-24"
                          size="large"
                        >
                          <Option value={0}>Level 1</Option>
                          <Option value={1}>Level 2</Option>
                          <Option value={2}>Level 3</Option>
                        </Select>
                        <Button
                          type="primary"
                          icon={<Save className="w-3 h-3" />}
                          onClick={addIndexEntry}
                          size="small"
                          disabled={
                            !newIndexEntry.title.trim() || !newIndexEntry.page
                          }
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Index List */}
                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                  {customIndex.length > 0 ? (
                    <div className="p-2">
                      {customIndex.map((entry) => (
                        <IndexEntryItem
                          key={entry.id}
                          entry={entry}
                          onPageClick={goToIndexPage}
                          onEdit={editIndexEntry}
                          onDelete={deleteIndexEntry}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No index entries yet</p>
                      <p className="text-xs">
                        Add custom page index entries above
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-600">
                    <strong>Total Pages:</strong>{" "}
                    {previewTotalPages > 0 ? previewTotalPages : "Not loaded"}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Index Entries:</strong> {customIndex.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  setUploadModal(false);
                  uploadForm.resetFields();
                  setUploadedImage(null);
                  setUploadedPDF(null);
                  // Reset preview states
                  setPreviewPDF(null);
                  setPreviewCurrentPage(1);
                  setPreviewTotalPages(0);
                  setPreviewOutlines([]);
                  setPreviewGoToPage("");
                  setShowPreviewIndex(false);
                  // Reset custom index states
                  setCustomIndex([]);
                  setNewIndexEntry({ title: "", page: "", level: 0 });
                  setShowCustomIndexForm(false);
                }}
              >
                Cancel
              </Button>
              <button
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-6  text-base bg-[#0F7490] hover:bg-[#0F7490]/90 text-white focus:ring-[#0F7490]/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 "
                type="submit"
              >
                Add Document
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default DigitalLibrary;
