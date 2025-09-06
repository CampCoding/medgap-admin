"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../../../../../data/subjects";
import { DigitalLibrary } from "../../../../../../../../../components/digital-library";

const DigitalLibraryPage = () => {
  const { id, unitId, topicId } = useParams();

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code == id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );

    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  return (
    <DigitalLibrary
      subject={selectedSubjectAndUnitWithTopic?.subject}
      unit={selectedSubjectAndUnitWithTopic?.unit}
      topic={selectedSubjectAndUnitWithTopic?.topic}
    />
  );
};

export default DigitalLibraryPage;