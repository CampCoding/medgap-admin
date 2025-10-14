"use client";

import React, { useEffect, useMemo, useState } from "react";
import BreadcrumbsShowcase from "../../../../../../../components/ui/BreadCrumbs";
import { useParams, useRouter } from "next/navigation";
import {
  BarChart3,
  Book,
  Download,
  Plus,
  Upload,
  Search,
  X,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  FileText,
  Library,
  HelpCircle,
} from "lucide-react";
import PageLayout from "../../../../../../../components/layout/PageLayout";
import Button from "../../../../../../../components/atoms/Button";
import PagesHeader from "../../../../../../../components/ui/PagesHeader";
import SearchAndFilters from "./../../../../../../../components/ui/SearchAndFilters";
import TopicCard from "../../../../../../../components/ui/Cards/TopicCard";
import AddTopicForm from "../../../../../../../components/Topics/AddNewTopic.modal";
import DeleteTopicModal from "../../../../../../../components/Topics/DeleteTopic.modal";
import {
  Card,
  Dropdown,
  Pagination,
  Spin,
  Table,
  Tag,
  Modal,
  Form,
  Input,
} from "antd";
import {
  searchTopics,
  filterTopics,
  sortTopics,
  hasActiveFilters,
  getDefaultFilters,
} from "../../../../../../../utils/topicsUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  handleDuplicateTopic,
  handleGetAllTopics,
} from "../../../../../../../features/topicsSlice";
import { toast } from "react-toastify";
import EditTopicForm from "../../../../../../../components/Topics/EditNewTopicModal";

/* ===================== Small debounce hook ===================== */
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const DEFAULT_LIMIT = 12;

const TopicsPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 450);

  const { unitId, id } = useParams();
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  // duplicate modal state
  const [dupOpen, setDupOpen] = useState(false);
  const [dupSource, setDupSource] = useState(null);
  const [dupName, setDupName] = useState("");
  const [dupLoading, setDupLoading] = useState(false);

  // filters (client-side only for now)
  const [filters, setFilters] = useState(getDefaultFilters());

  // pagination (server-side)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const dispatch = useDispatch();
  const { topics_list, topics_loading } = useSelector(
    (state) => state?.topics
  );

  /* ===================== Fetch topics: unit/page/limit/search ===================== */
  useEffect(() => {
    if (!unitId) return;
    dispatch(
      handleGetAllTopics({
        unit_id: decodeURIComponent(String(unitId)),
        page,
        limit,
        search: debouncedSearch
          ? decodeURIComponent(String(debouncedSearch))
          : "",
      })
    );
  }, [dispatch, unitId, page, limit, debouncedSearch]);

  // derive data from API response
  const apiTopics = topics_list?.data?.topics || [];
  const total = topics_list?.pagination?.total || 0;
  const moduleName =
    apiTopics?.[0]?.module_name ||
    topics_list?.data?.module_name ||
    "Modules";
  const unitName =
    apiTopics?.[0]?.unit_name ||
    topics_list?.data?.unit_name ||
    decodeURIComponent(String(unitId));

  // normalize for UI components
  const topics = useMemo(() => {
    return (apiTopics || []).map((t) => ({
      id: t.topic_id,
      topic_id: t.topic_id,
      name: t.topic_name,
      topic_name: t.topic_name,
      short_description: t.short_description,
      learning_objectives: t.learning_objectives,
      status: t.status,
      tags: t.tags,
      unit_id: t.unit_id,
      unitName: t.unit_name,
      subjectName: t.module_name,
      subjectCode: t.module_code,
      questions_count: t.questions_count,
      flashcards_count: t.flashcards_count,
      library_files_count: t.library_files_count,
      created_at: t.created_at,
      updated_at: t.updated_at,
      created_by_name: t.created_by_name,
      updated_by_name: t.updated_by_name,
      topic_order: t.topic_order,
    }));
  }, [apiTopics]);

  // client-side search/filter/sort (applies to the current server page)
  const filteredOnClient = useMemo(() => {
    let arr = searchTopics(topics, debouncedSearch);
    arr = filterTopics(arr, filters);
    arr = sortTopics(arr, filters.sortBy, filters.sortOrder);
    return arr;
  }, [topics, debouncedSearch, filters]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: moduleName, href: "#" },
    { label: unitName, href: "#", current: true },
  ];

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters(getDefaultFilters());
  };

  const hasActiveFiltersData = () => hasActiveFilters(debouncedSearch, filters);

  const onChangePage = (nextPage, nextPageSize) => {
    if (nextPageSize && nextPageSize !== limit) {
      setLimit(nextPageSize);
      setPage(1);
    } else {
      setPage(nextPage);
    }
  };

  // open duplicate modal with default name
  const openDuplicate = (topic) => {
    const baseName = topic?.topic_name || topic?.name || "Untitled Topic";
    setDupSource(topic);
    setDupName(`${baseName} (Copy)`);
    setDupOpen(true);
  };

  const submitDuplicate = async () => {
    if (!dupSource) return;
    const name = dupName.trim();
    if (!name) {
      toast.error("Please enter a topic name");
      return;
    }
    setDupLoading(true);
    try {
      const res = await dispatch(
        handleDuplicateTopic({
          id: dupSource?.id,
          body: {
            unit_id: unitId,
            topic_name: name,
          },
        })
      ).unwrap();

      if (res?.status === "success") {
        toast.success(res?.message || "Topic duplicated");
        setDupOpen(false);
        setDupSource(null);
        setDupName("");
        // refresh list preserving pagination & search
        dispatch(
          handleGetAllTopics({
            unit_id: decodeURIComponent(String(unitId)),
            page,
            limit,
            search: debouncedSearch
              ? decodeURIComponent(String(debouncedSearch))
              : "",
          })
        );
      } else {
        toast.error(res?.message || "Failed to duplicate topic");
      }
    } catch (e) {
      toast.error(e?.message || "An error occurred while duplicating");
    } finally {
      setDupLoading(false);
    }
  };

  const handleViewDetails = (topic) => {
    router.push(`/subjects/${id}/units/${unitId}/topics/${topic?.id}`);
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setEditModal(true);
  };

  const handleQuestions = (topic) => {
    router.push(`/subjects/${id}/units/${unitId}/topics/${topic?.id}/questions`);
  };

  const handleFlashcards = (topic) => {
    router.push(`/subjects/${id}/units/${unitId}/topics/${topic?.id}/flashcards`);
  };

  const handleLibrary = (topic) => {
    router.push(`/subjects/${id}/units/${unitId}/topics/${topic?.id}/digital-library`);
  };

  const closeEdit = () => {
    setEditModal(false);
    setEditingTopic(null);
  };

  const handleEditSuccess = () => {
    closeEdit();
    dispatch(
      handleGetAllTopics({
        unit_id: decodeURIComponent(String(unitId)),
        page,
        limit,
        search: debouncedSearch
          ? decodeURIComponent(String(debouncedSearch))
          : "",
      })
    );
  };

  /* ===================== Table columns with dropdown menu ===================== */
  const columns = [
    {
      title: "Topic",
      dataIndex: "topic_name",
      key: "topic_name",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          {record.short_description ? (
            <span className="text-gray-500 text-sm line-clamp-1">
              {record.short_description}
            </span>
          ) : null}
        </div>
      ),
      sorter: (a, b) => a.topic_name.localeCompare(b.topic_name),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color =
          status === "active"
            ? "green"
            : status === "draft"
            ? "orange"
            : "default";
        return <Tag color={color}>{status || "—"}</Tag>;
      },
      filters: [
        { text: "Active", value: "active" },
        { text: "Draft", value: "draft" },
        { text: "Archived", value: "archived" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Questions",
      dataIndex: "questions_count",
      key: "questions_count",
      width: 120,
      sorter: (a, b) =>
        (a.questions_count || 0) - (b.questions_count || 0),
      render: (count) => count || 0,
    },
    {
      title: "Flashcards",
      dataIndex: "flashcards_count",
      key: "flashcards_count",
      width: 120,
      sorter: (a, b) =>
        (a.flashcards_count || 0) - (b.flashcards_count || 0),
      render: (count) => count || 0,
    },
    
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (val) => (val ? new Date(val).toLocaleString() : "—"),
      sorter: (a, b) =>
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime(),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 180,
      render: (val) => (val ? new Date(val).toLocaleString() : "—"),
      sorter: (a, b) =>
        new Date(a.updated_at || 0).getTime() -
        new Date(b.updated_at || 0).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <Eye className="w-4 h-4" />,
                onClick: () => handleViewDetails(record),
              },
              {
                key: "edit",
                label: "Edit Topic",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => handleEdit(record),
              },
              {
                key: "duplicate",
                label: "Duplicate",
                icon: <Copy className="w-4 h-4" />,
                onClick: () => openDuplicate(record),
              },
              {
                key: "questions",
                label: `Questions (${record.questions_count || 0})`,
                icon: <HelpCircle className="w-4 h-4" />,
                onClick: () => handleQuestions(record),
              },
              {
                key: "flashcards",
                label: `Flashcards (${record.flashcards_count || 0})`,
                icon: <FileText className="w-4 h-4" />,
                onClick: () => handleFlashcards(record),
              },
              // {
              //   key: "library",
              //   label: `Library (${record.library_files_count || 0})`,
              //   icon: <Library className="w-4 h-4" />,
              //   onClick: () => handleLibrary(record),
              // },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete",
                icon: <X className="w-4 h-4" />,
                danger: true,
                onClick: () => {
                  setDeleteModal(true);
                  setSelectedData(record);
                },
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="default"
            size="small"
            icon={<MoreHorizontal className="w-4 h-4" />}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageLayout>
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={<>Subject: {unitName}</>}
          subtitle={"Organize and manage your teaching subjects"}
          extra={
            <div className="flex items-center space-x-4">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                Import
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
              {/* <Button
                onClick={() => setAddTopicModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                Add New Topic
              </Button> */}
            </div>
          }
        />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          showFilters={false}
          setShowFilters={() => {}}
          setSearchTerm={(v) => {
            setSearchTerm(v);
            setPage(1);
          }}
          searchPlacehodler="Search topics, descriptions..."
        />

        <Spin spinning={!!topics_loading}>
          {filteredOnClient.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No topics found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {debouncedSearch || hasActiveFiltersData()
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No topics are available at the moment."}
                  </p>
                  {(debouncedSearch || hasActiveFiltersData()) && (
                    <Button
                      type="primary"
                      onClick={clearAllFilters}
                      icon={<X className="w-4 h-4" />}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : viewMode === "table" ? (
            <>
              <Table
                rowKey={(r) => r.topic_id}
                dataSource={filteredOnClient}
                columns={columns}
                pagination={{
                  current: page,
                  pageSize: limit,
                  total,
                  showSizeChanger: true,
                  onChange: onChangePage,
                }}
                scroll={{ x: 1000 }}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOnClient.map((topic, index) => (
                  <TopicCard
                    id={id}
                    unitId={unitId}
                    key={topic.topic_id ?? index}
                    topic={topic}
                    onDuplicate={openDuplicate} // ← open modal from card
                    onEdit={() => handleEdit(topic)}
                    onViewDetails={handleViewDetails}
                    onQuestions={handleQuestions}
                    onFlashcards={handleFlashcards}
                    onLibrary={handleLibrary}
                    onDeleteTopic={(e, data) => {
                      setDeleteModal(true);
                      setSelectedData(data);
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={total}
                  showSizeChanger
                  onChange={onChangePage}
                />
              </div>
            </>
          )}
        </Spin>

        <AddTopicForm
          open={addTopicModal}
          onCancel={() => setAddTopicModal(false)}
          defaultUnitId={Number(unitId) || 1}
        />

        <DeleteTopicModal
          data={selectedData}
          open={deleteModal}
          setOpen={setDeleteModal}
        />

        <EditTopicForm
          open={editModal}
          topic={editingTopic}
          defaultUnitId={unitId}
          onCancel={closeEdit}
          onSuccess={handleEditSuccess}
        />

        {/* Duplicate Topic Modal */}
        <Modal
          title="Duplicate Topic"
          open={dupOpen}
          onOk={submitDuplicate}
          okText="Duplicate"
          confirmLoading={dupLoading}
          onCancel={() => setDupOpen(false)}
          okButtonProps={{
            className :"!bg-blue-500 text-white"
          }}
        >
          <Form layout="vertical" onFinish={submitDuplicate}>
            <Form.Item label="New topic name" required>
              <Input
                placeholder="Enter new topic name"
                value={dupName}
                onChange={(e) => setDupName(e.target.value)}
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </Modal>
      </PageLayout>
    </div>
  );
};

export default TopicsPage;
