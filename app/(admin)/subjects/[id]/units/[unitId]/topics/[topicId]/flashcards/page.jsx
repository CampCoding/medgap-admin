"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../../../../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "./../../../../../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../../../../../components/ui/PagesHeader";
import { BarChart3, Book, BookOpen, Layers, Plus } from "lucide-react";
import Button from "../../../../../../../../../components/atoms/Button";
import Link from "next/link";
import { subjects } from "../../../../../../../../../data/subjects";
import { useParams } from "next/navigation";
import SearchAndFilters from "./../../../../../../../../../components/ui/SearchAndFilters";
import Flashcard from "../../../../../../../../../components/Flashcardas/FlashCard";

const FlashcardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { id, unitId, topicId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [mode, setMode] = useState("grid");

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );
    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Flashcards", href: "#", current: true },
  ];

const flashcards = [
  {
    id: 1,
    difficulty: "easy",
    type: "MCQ",
    front: "Patient",
    back: "A person receiving medical treatment",
    pronunciation: "pay-shunt",
    example: "The patient needs immediate attention",
    exampleTranslation:
      "The person receiving medical care requires urgent help",
  },
  {
    id: 2,
    difficulty: "easy",
    type: "True/False",
    front: "Doctor",
    back: "A qualified medical practitioner",
    pronunciation: "dok-ter",
    example: "The doctor examined the patient",
    exampleTranslation:
      "The medical practitioner checked the person's condition",
  },
  {
    id: 3,
    difficulty: "medium",
    type: "Fill-in-the-Blank",
    front: "Nurse",
    back: "A healthcare professional who provides patient care",
    pronunciation: "nurs",
    example: "The nurse takes care of the patients",
    exampleTranslation: "The healthcare worker provides care for people",
  },
  {
    id: 4,
    difficulty: "easy",
    type: "MCQ",
    front: "Pharmacist",
    back: "A healthcare professional who dispenses medications",
    pronunciation: "far-ma-sist",
    example: "The pharmacist sells medicine",
    exampleTranslation: "The medication specialist provides drugs",
  },
  {
    id: 5,
    difficulty: "medium",
    type: "MCQ",
    front: "Pain",
    back: "An unpleasant physical sensation",
    pronunciation: "payn",
    example: "I feel pain in my head",
    exampleTranslation: "I experience discomfort in my head",
  },
  {
    id: 6,
    difficulty: "medium",
    type: "True/False",
    front: "Fever",
    back: "An abnormally high body temperature",
    pronunciation: "fee-ver",
    example: "The patient has a fever",
    exampleTranslation: "The person has elevated body temperature",
  },
  {
    id: 7,
    difficulty: "easy",
    type: "MCQ",
    front: "Cough",
    back: "A sudden expulsion of air from the lungs",
    pronunciation: "kof",
    example: "The patient coughs a lot",
    exampleTranslation: "The person frequently expels air from lungs",
  },
  {
    id: 8,
    difficulty: "hard",
    type: "Fill-in-the-Blank",
    front: "Headache",
    back: "Pain in the head or upper neck",
    pronunciation: "hed-ayk",
    example: "I have a severe headache",
    exampleTranslation: "I experience intense pain in my head",
  },
  {
    id: 9,
    difficulty: "medium",
    type: "MCQ",
    front: "Surgery",
    back: "The treatment of injuries or disorders by cutting open the body",
    pronunciation: "sur-juh-ree",
    example: "The patient underwent heart surgery",
    exampleTranslation: "The person had an operation on the heart",
  },
  {
    id: 10,
    difficulty: "hard",
    type: "True/False",
    front: "Anesthesia",
    back: "Loss of sensation with or without loss of consciousness",
    pronunciation: "an-es-thee-zhuh",
    example: "Anesthesia was administered before the operation",
    exampleTranslation: "The patient was given drugs to prevent feeling pain",
  },
  {
    id: 11,
    difficulty: "easy",
    type: "MCQ",
    front: "Clinic",
    back: "A place where medical treatment is provided",
    pronunciation: "kli-nik",
    example: "I have an appointment at the clinic tomorrow",
    exampleTranslation: "I am visiting the healthcare facility tomorrow",
  },
  {
    id: 12,
    difficulty: "medium",
    type: "Fill-in-the-Blank",
    front: "Diagnosis",
    back: "The identification of the nature of an illness",
    pronunciation: "dai-ag-no-sis",
    example: "The doctor made a quick diagnosis",
    exampleTranslation: "The physician identified the disease rapidly",
  },
  {
    id: 13,
    difficulty: "hard",
    type: "True/False",
    front: "Prescription",
    back: "A written order for medicine from a doctor",
    pronunciation: "pruh-skrip-shun",
    example: "The pharmacist filled my prescription",
    exampleTranslation: "The medicine order from the doctor was prepared",
  },
  {
    id: 14,
    difficulty: "medium",
    type: "MCQ",
    front: "Vaccine",
    back: "A substance that stimulates the immune system to protect against disease",
    pronunciation: "vak-seen",
    example: "Children receive vaccines at an early age",
    exampleTranslation: "Young individuals are given disease-preventing injections",
  },
  {
    id: 15,
    difficulty: "hard",
    type: "Fill-in-the-Blank",
    front: "Therapy",
    back: "Treatment to relieve or heal a disorder",
    pronunciation: "theh-ruh-pee",
    example: "The patient is undergoing physical therapy",
    exampleTranslation: "The person is in a treatment to restore physical health",
  }
];



  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        extra={
          <div className="flex  space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
              <Layers className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-[#202938]">
                9 Flashcards
              </span>
            </div>
            <Link href={"flashcards/new"}>
              <Button
                type="accent"
                size="large"
                className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Flashcard
              </Button>
            </Link>
          </div>
        }
        title={
          <span className="">
            {selectedSubjectAndUnitWithTopic?.topic?.name} :{" "}
            <span className="text-accent">Flashcards</span>
          </span>
        }
        subtitle={"Manage and organize your Flashcards"}
      />

      <SearchAndFilters
        searchPlacehodler={"Search Flashcards"}
        noMode={true}
        setSearchTerm={searchTerm}
        searchTerm={searchTerm}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {
          flashcards.map((item , i) => {
            return(
              <Flashcard
                data={item}
                key={i}
              />

            )
          })
        }
      </div>
    </PageLayout>
  );
};

export default FlashcardPage;
