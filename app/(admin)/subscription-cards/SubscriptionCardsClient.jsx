"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fetchData } from "@/api/apiInstance";
import { Select, Spin } from "antd";
import {
  Calendar,
  ClipboardCopy,
  CreditCard,
  Loader2,
  RefreshCcw,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

const getValueFromPath = (object, path) => {
  if (!path || !object) return undefined;
  return path.split(".").reduce((acc, segment) => acc?.[segment], object);
};

const extractArrayFromPayload = (payload, hints = []) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  for (const hint of hints) {
    const hintedValue = getValueFromPath(payload, hint);
    if (Array.isArray(hintedValue)) return hintedValue;
  }

  if (payload?.data && typeof payload.data === "object") {
    const nested = extractArrayFromPayload(payload.data, hints);
    if (nested.length) return nested;
  }

  const firstArray = Object.values(payload).find((value) => Array.isArray(value));
  if (Array.isArray(firstArray)) return firstArray;

  return [];
};

const mergeSelectedOptions = (options, selectedValues = []) => {
  if (!selectedValues?.length) return options;
  const seen = new Set(options.map((option) => `${option.value}`));
  const missing = selectedValues
    .filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        !seen.has(`${value}`)
    )
    .map((value) => ({
      value,
      label: `#${value}`,
    }));

  return [...options, ...missing];
};

const buildResourceUrl = (basePath, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const postmanDocumentedRoutes = {
  books: {
    path: "e-books/list",
    defaults: { limit: 25000 },
  },
  topics: {
    path: "topics/all",
    defaults: { limit: 25000 },
  },
  exams: {
    // TODO: add the admin exams endpoint path here once available.
    path: "exams",
    defaults: { limit: 25000 },
  },
  modules: {
    path: "modules",
    defaults: { limit: 25000 },
  },
};

const createResourceConfig = (route, config) => {
  if (!route?.path) return null;
  return {
    buildUrl: (search) =>
      buildResourceUrl(route.path, {
        ...route.defaults,
        search,
      }),
    ...config,
  };
};

const resourceCatalog = {
  book: createResourceConfig(postmanDocumentedRoutes.books, {
    arrayHints: ["data.books", "data.data", "books"],
    getLabel: (item) =>
      item?.title ||
      item?.name ||
      item?.book_title ||
      `Book #${item?.ebook_id ?? item?.id ?? item?.code ?? ""}`,
    getValue: (item) => item?.ebook_id ?? item?.id ?? item?.code,
  }),
  topic: createResourceConfig(postmanDocumentedRoutes.topics, {
    arrayHints: ["data.topics", "data.data", "topics"],
    getLabel: (item) =>
      item?.name ||
      item?.title ||
      item?.topic_title ||
      `${item?.topic_name } - ${item?.unit_name} - ${item?.module_name} - created by ${item?.created_by_name}`,
    getValue: (item) => item?.topic_id ?? item?.id ?? item?.code,
  }),
  exam: createResourceConfig(postmanDocumentedRoutes.exams, {
    arrayHints: ["data.exams", "data.data", "exams"],
    getLabel: (item) =>
      item?.title ||
      item?.name ||
      item?.exam_title ||
      `Exam #${item?.id ?? item?.exam_id ?? ""}`,
    getValue: (item) => item?.id ?? item?.exam_id ?? item?.code,
  }),
  module: createResourceConfig(postmanDocumentedRoutes.modules, {
    arrayHints: ["data.modules", "data.data", "modules"],
    getLabel: (item) =>
      item?.name ||
      item?.title ||
      item?.module_name ||
      item?.subject_name ||
      `Module #${item?.module_id ?? item?.id ?? item?.code ?? ""}`,
    getValue: (item) => item?.module_id ?? item?.id ?? item?.code,
  }),
};

const typeOptions = [
  { label: "Books", value: "book", helper: "IDs of books to unlock" },
  { label: "Topics", value: "topic", helper: "IDs of topics to unlock" },
  { label: "Exams", value: "exam", helper: "IDs of exams to unlock" },
  { label: "Modules", value: "module", helper: "IDs of modules to unlock" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Expired", value: "expired" },
];

const sourceKeyByType = {
  book: "books",
  topic: "topics",
  exam: "exams",
  module: "modules",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const SubscriptionCardsClient = () => {
  const [cards, setCards] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [listError, setListError] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "book",
    end_date: "",
    status: "active",
    linkedResources: [],
    number_of_cards: 1,
  });
  const [resourceOptions, setResourceOptions] = useState([]);
  const [resourceSearch, setResourceSearch] = useState("");
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState("");
  const [newlyCreatedCards, setNewlyCreatedCards] = useState([]);
  const linkedResourcesRef = useRef(formData.linkedResources);
  const resourceTypeSupported = Boolean(resourceCatalog[formData.type]);

  const listEndpoint = useMemo(() => {
    if (!statusFilter || statusFilter === "all") return "subscription-cards";
    return `subscription-cards?status=${statusFilter}`;
  }, [statusFilter]);

  const loadCards = useCallback(async () => {
    setIsLoadingList(true);
    setListError("");
    const response = await fetchData({ url: listEndpoint, method: "GET" });

    if (response?.status === "success") {
      const fetchedCards = Array.isArray(response?.data) ? response.data : [];
      setCards(fetchedCards);
      setPagination(response?.pagination ?? null);
    } else {
      const message =
        response?.message ||
        response ||
        "Unable to fetch subscription cards. Please try again.";
      setListError(message);
      toast.error(message);
    }
    setIsLoadingList(false);
  }, [listEndpoint]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  useEffect(() => {
    linkedResourcesRef.current = formData.linkedResources;
  }, [formData.linkedResources]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        linkedResources: [],
      }));
      setResourceSearch("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_cards" ? Number(value) : value,
    }));
  };

  const handleLinkedResourcesChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      linkedResources: values,
    }));
  };

  const fetchResourceOptions = useCallback(
    async (resourceType, searchTerm = "") => {
      const config = resourceCatalog[resourceType];
      // if (!config) {
      //   const missingMessage = `No admin endpoint configured for ${resourceType}s. Update postmanDocumentedRoutes.${resourceType}.path to enable this selector.`;
      //   setResourceError(missingMessage);
      //   setResourceOptions(mergeSelectedOptions([], linkedResourcesRef.current));
      //   setResourceLoading(false);
      //   return;
      // }

      setResourceLoading(true);
      setResourceError("");
      const response = await fetchData({
        url: config.buildUrl(searchTerm),
        method: "GET",
      });
      setResourceLoading(false);

      if (!response || typeof response === "string") {
        const message =
          typeof response === "string"
            ? response
            : "Unable to load resources. Please try again.";
        setResourceError(message);
        toast.error(message);
        setResourceOptions((prev) => mergeSelectedOptions([], linkedResourcesRef.current));
        return;
      }

      if (
        response?.status &&
        response?.status !== "success" &&
        response?.status !== true
      ) {
        const message = response?.message || "Unable to load resources.";
        setResourceError(message);
        toast.error(message);
        setResourceOptions((prev) => mergeSelectedOptions([], linkedResourcesRef.current));
        return;
      }

      const items = extractArrayFromPayload(response, config.arrayHints);
      const mapped =
        items
          ?.map((item) => {
            const value = config.getValue(item);
            if (value === undefined || value === null) return null;
            return {
              value,
              label:
                config.getLabel(item) ||
                `#${value}`,
            };
          })
          .filter(Boolean) || [];

      setResourceOptions(mergeSelectedOptions(mapped, linkedResourcesRef.current));
    },
    []
  );

  useEffect(() => {
    if (!resourceCatalog[formData.type]) {
      const missingMessage = `No admin endpoint configured for ${formData.type}s. Update postmanDocumentedRoutes.${formData.type}.path to enable this selector.`;
      setResourceError(missingMessage);
      setResourceOptions(mergeSelectedOptions([], linkedResourcesRef.current));
      setResourceLoading(false);
      return;
    }

    const delay = setTimeout(() => {
      fetchResourceOptions(formData.type, resourceSearch);
    }, 400);

    return () => clearTimeout(delay);
  }, [formData.type, resourceSearch, fetchResourceOptions]);

  const buildSourcePayload = () => {
    if (!formData.linkedResources?.length) {
      return null;
    }

    const parsedValues = formData.linkedResources.map((entry) => {
      const asNumber = Number(entry);
      return Number.isNaN(asNumber) ? entry : asNumber;
    });

    return {
      [sourceKeyByType[formData.type]]: parsedValues,
    };
  };

  const handleCreateCard = async (event) => {
    event.preventDefault();

    const resourceDefinition = resourceCatalog[formData.type];
    if (!resourceDefinition) {
      toast.error(
        `Linked ${formData.type}s are unavailable until you set postmanDocumentedRoutes.${formData.type}.path to the correct admin endpoint.`
      );
      return;
    }

    if (!formData.end_date) {
      toast.error("Please select an end date.");
      return;
    }

    if (!formData.number_of_cards || formData.number_of_cards < 1) {
      toast.error("Number of cards must be at least 1.");
      return;
    }

    const source = buildSourcePayload();
    if (!source) {
      toast.error("Please provide at least one ID in the source field.");
      return;
    }

    const payload = {
      type: formData.type,
      end_date: formData.end_date,
      status: formData.status,
      source,
      number_of_cards: formData.number_of_cards,
    };

    if (formData.code.trim()) {
      payload.code = formData.code.trim();
    }

    // Store existing card IDs before creation to filter new ones later
    const existingCardIds = new Set(
      cards.map((card) => card.card_id || card.id || card.code).filter(Boolean)
    );

    setIsCreating(true);
    const response = await fetchData({
      url: "subscription-cards/create",
      method: "POST",
      body: payload,
    });
    setIsCreating(false);

    if (response?.status === "success") {
      toast.success(response?.message || "Subscription card created.");
      
      setFormData((prev) => ({
        ...prev,
        code: "",
        linkedResources: [],
        number_of_cards: 1,
      }));
      
      // Reload cards and filter newly created ones
      // Fetch all cards (not filtered) to properly identify newly created ones
      const reloadResponse = await fetchData({ url: "subscription-cards", method: "GET" });
      if (reloadResponse?.status === "success") {
        const allCards = Array.isArray(reloadResponse?.data) ? reloadResponse.data : [];
        
        // Filter newly created cards from returned data
        const newlyCreated = allCards.filter(
          (card) => !existingCardIds.has(card.card_id || card.id || card.code)
        );
        
        if (newlyCreated.length > 0) {
          setNewlyCreatedCards(newlyCreated);
        }
        
        // Update the cards list based on current filter
        loadCards();
      } else {
        // Fallback: try to get from response data if available
        const createdCards = Array.isArray(response?.data) ? response.data : [];
        if (createdCards.length > 0) {
          setNewlyCreatedCards(createdCards);
        }
        loadCards();
      }
      return;
    }

    toast.error(
      response?.message || response || "Unable to create card. Please retry."
    );
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Card code copied to clipboard.");
    } catch (error) {
      toast.error("Failed to copy the card code.");
    }
  };

  const exportToExcel = () => {
    if (!newlyCreatedCards || newlyCreatedCards.length === 0) {
      toast.warning("No newly created cards to export. Please create cards first.");
      return;
    }

    // Prepare data for Excel export
    const exportData = newlyCreatedCards.map((card) => ({
      Code: card.code || "-",
      Type: card.type || "-",
      Resources: card?.source
        ? Object.entries(card.source)
            .map(([key, value]) => `${key}: ${(value || []).join(", ")}`)
            .join(" | ")
        : "-",
      "End Date": formatDate(card.end_date),
      Status: card.status || "-",
      "Created At": formatDate(card.created_at),
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subscription Cards");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `subscription-cards-${timestamp}.xlsx`;

    // Write and download
    XLSX.writeFile(wb, filename);
    toast.success(`Exported ${newlyCreatedCards.length} card(s) to Excel.`);
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Engagement
          </p>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Subscription Cards
            <span className="text-teal-600">
              <CreditCard className="w-7 h-7" />
            </span>
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl">
            Generate card batches for books, topics, exams, or modules and track every
            active code in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {newlyCreatedCards.length > 0 && (
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              <Download className="w-4 h-4" />
              Export Created ({newlyCreatedCards.length})
            </button>
          )}
          <button
            onClick={loadCards}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:opacity-60"
            disabled={isLoadingList}
          >
            {isLoadingList ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </>
            )}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleCreateCard}
          className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-teal-900/5 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Create new cards
              </h2>
              <p className="text-sm text-slate-500">
                Fill the details and generate a batch instantly.
              </p>
            </div>
            {isCreating && <Loader2 className="w-5 h-5 animate-spin text-teal-500" />}
          </div>

          <div className="mt-6 space-y-5">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">
                Custom code (optional)
              </span>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                placeholder="Leave blank for auto-generated codes"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">Type</span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500">
                  {typeOptions.find((opt) => opt.value === formData.type)?.helper}
                </span>
              </label>

              {/* <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">
                  Card status
                </span>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label> */}
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">
                Linked resources
              </span>
              <Select
                mode="multiple"
                showSearch
                allowClear
                className="w-full rounded-2xl"
                value={formData.linkedResources}
                onChange={handleLinkedResourcesChange}
                onSearch={(value) => setResourceSearch(value)}
                placeholder={`Search ${formData.type}s and select IDs`}
                filterOption={false}
                options={resourceOptions}
                disabled={!resourceTypeSupported}
                notFoundContent={
                  !resourceTypeSupported ? (
                    <div className="px-3 py-2 text-sm text-amber-600">
                      Configure postmanDocumentedRoutes.{formData.type}.path to
                      enable searching {formData.type}s.
                    </div>
                  ) : resourceLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
                      <Spin size="small" /> Searching {formData.type}s...
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-500">
                      No matches found
                    </div>
                  )
                }
                onClear={() => setResourceSearch("")}
                maxTagCount="responsive"
                dropdownMatchSelectWidth={false}
                popupClassName="subscription-resources-dropdown"
              />
              <span className="text-xs text-slate-500">
                Live data pulled from the Postman collection endpoints. Search by
                name, title, or code to attach exact IDs.
              </span>
              {resourceError && (
                <span className="text-xs text-red-600">{resourceError}</span>
              )}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">
                  Number of cards
                </span>
                <input
                  type="number"
                  min="1"
                  name="number_of_cards"
                  value={formData.number_of_cards}
                  onChange={handleFormChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-inner focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-700">
                  Expiry date
                </span>
                <div className="relative">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleFormChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-inner focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:from-teal-500 hover:to-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating cards...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Generate cards
                </>
              )}
            </button>
            <p className="text-sm text-slate-500">
              Cards will be generated instantly and can be downloaded from the
              list.
            </p>
          </div>
        </form>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-blue-900/5 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Issued cards
              </h2>
              <p className="text-sm text-slate-500">
                Filter by status and keep track of generated codes.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading cards...
              </div>
            ) : listError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-6 text-sm text-red-700">
                {listError}
              </div>
            ) : cards.length ? (
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="py-3 pr-4">Code</th>
                    <th className="py-3 pr-4">Type</th>
                    <th className="py-3 pr-4">Resources</th>
                    <th className="py-3 pr-4">End date</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {cards.map((card) => (
                    <tr key={card.card_id} className="align-top">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold tracking-wide text-slate-900">
                            {card.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(card.code)}
                            className="rounded-full border border-slate-200 p-1 text-slate-400 hover:text-teal-600"
                          >
                            <ClipboardCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 pr-4 capitalize text-slate-600">
                        {card.type || "-"}
                      </td>
                      <td className="py-4 pr-4 text-slate-600">
                        {card?.source
                          ? Object.entries(card.source)
                              .map(([key, value]) => `${key}: ${(value || []).join(", ")}`)
                              .join(" | ")
                          : "-"}
                      </td>
                      <td className="py-4 pr-4 text-slate-600">
                        {formatDate(card.end_date)}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            card.status === "active"
                              ? "bg-green-50 text-green-700"
                              : card.status === "expired"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {card.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-600">
                        {formatDate(card.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No cards found for the selected status.
                </p>
                <p className="text-xs text-slate-500">
                  Generate your first batch to see them listed here.
                </p>
              </div>
            )}
          </div>

          {pagination && (
            <p className="mt-4 text-xs text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages || 1}.{" "}
              Total records: {pagination.total ?? cards.length}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionCardsClient;

