"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, Tag, Spin, Divider, Progress, Button, Tooltip } from "antd";
import { handleTopicDetails } from "../../../../../../../../features/topicsSlice";
import PageLayout from "../../../../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  HelpCircle,
  Layers,
  Library,
  Calendar,
  Clock,
  User,
  Edit3,
  Share2,
  BookOpen,
  Target,
  Hash,
  TrendingUp,
} from "lucide-react";
import PagesHeader from "../../../../../../../../components/ui/PagesHeader";

export default function Page() {
  const { topicId } = useParams();
  const dispatch = useDispatch();
  const { topic_details, topic_details_loading } = useSelector(
    (state) => state?.topics
  );

  useEffect(() => {
    if (!topicId) return;
    dispatch(handleTopicDetails({ id: topicId }));
  }, [dispatch, topicId]);

  const topic = topic_details?.data?.topic;

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: topic?.module_name, href: "/subjects", icon: Book },
    topic
      ? { label: topic.unit_name, href: "#" }
      : { label: "Loading…", href: "#" },
    topic
      ? { label: topic.topic_name, href: "#", current: true }
      : { label: "—", href: "#", current: true },
  ];

  const statusConfig = {
    active: { color: "success", bgColor: "bg-green-50", textColor: "text-green-700", dotColor: "bg-green-400" },
    draft: { color: "warning", bgColor: "bg-amber-50", textColor: "text-amber-700", dotColor: "bg-amber-400" },
    default: { color: "default", bgColor: "bg-gray-50", textColor: "text-gray-700", dotColor: "bg-gray-400" }
  };

  const currentStatus = statusConfig[topic?.status] || statusConfig.default;

  const fmt = (d) => (d ? new Date(d).toLocaleString() : "—");

  // Calculate completion percentage (mock calculation)
  const completionPercentage = topic ? Math.min(
    ((topic.questions_count || 0) * 30 + 
     (topic.flashcards_count || 0) * 25 + 
     (topic.library_files_count || 0) * 20 +
     (topic.short_description ? 15 : 0) +
     (topic.learning_objectives ? 10 : 0)), 100
  ) : 0;

  const StatCard = ({ title, count, icon: Icon, color, gradient }) => (
    <Card 
      className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${gradient}`}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white/80 mb-1">{title}</div>
          <div className="text-3xl font-bold text-white">{count ?? 0}</div>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
    </Card>
  );

  return (
    <PageLayout>
      <div dir="ltr" className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        
        <div className="flex items-center justify-between mb-8">
          <PagesHeader 
            title={<>Topic: {topic?.topic_name || 'Loading...'}</>}
            subtitle={"Organize and manage your teaching Topics"}
          />
          
        </div>

        <Spin spinning={!!topic_details_loading}>
          {!topic ? (
            <Card className="mt-6 border-0 shadow-lg rounded-3xl">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <div className="text-xl text-gray-500 mb-2">لا توجد بيانات لهذا الدرس حتى الآن</div>
                <div className="text-gray-400">يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني</div>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Header Card with Status and Progress */}
              <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900">{topic.topic_name}</h1>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bgColor}`}>
                        <div className={`w-2 h-2 rounded-full ${currentStatus.dotColor}`}></div>
                        <span className={`text-sm font-medium ${currentStatus.textColor}`}>
                          {topic.status || "غير محدد"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <Book className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700 font-medium">{topic.module_name}</span>
                      </span>
                      <span className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700 font-medium">{topic.unit_name}</span>
                      </span>
                      <span className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        آخر تحديث: {fmt(topic.updated_at)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                 
                  </div>
                </div>

                {/* Enhanced Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="الأسئلة"
                    count={topic.questions_count}
                    icon={HelpCircle}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  />
                  <StatCard
                    title="فلاش كاردز"
                    count={topic.flashcards_count}
                    icon={Layers}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                  <StatCard
                    title="ملفات المكتبة"
                    count={topic.library_files_count}
                    icon={Library}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                  />
                </div>
              </Card>

              {/* Content Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description & Objectives */}
                <Card className="border-0 shadow-lg rounded-3xl h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">الوصف والأهداف</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        الوصف المختصر
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-gray-700 leading-relaxed">
                          {topic.short_description || "لم يتم إضافة وصف لهذا الموضوع بعد."}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        الأهداف التعليمية
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-2xl">
                        <p className="text-gray-700 leading-relaxed">
                          {topic.learning_objectives || "لم يتم تحديد الأهداف التعليمية بعد."}
                        </p>
                      </div>
                    </div>

                    {!!topic.tags?.length && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Hash className="w-4 h-4 text-emerald-600" />
                          الوسوم
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {topic.tags.map((tag, index) => (
                            <Tag 
                              key={tag} 
                              className="px-3 py-1 rounded-full border-0 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 font-medium"
                            >
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Metadata */}
                <Card className="border-0 shadow-lg rounded-3xl h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">بيانات إضافية</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "رقم الموضوع", value: topic.topic_id, icon: Hash },
                      { label: "ترتيب العرض", value: topic.topic_order ?? "—", icon: BarChart3 },
                      { label: "أُنشئ في", value: fmt(topic.created_at), icon: Calendar },
                      { label: "حدّث في", value: fmt(topic.updated_at), icon: Clock },
                      { label: "أنشأه", value: topic.created_by_name || "—", icon: User },
                      { label: "عدّله", value: topic.updated_by_name || "—", icon: User },
                    ].map(({ label, value, icon: Icon }, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700">{label}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Spin>
      </div>
    </PageLayout>
  );
}