"use client";
import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../../../data/subjects";
import { DigitalLibrary } from "../../../../../../../components/digital-library";
import { useDispatch } from "react-redux";
import { handleGetAllEbooks } from "../../../../../../../features/ebookSlice";
import axios from "axios";
import { conifgs } from "../../../../../../../config";

const DigitalLibraryPage = () => {
  const { id , unitId} = useParams();
  const dispatch = useDispatch();

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code == id);
    return { subject };
  }, [id]);
   
    useEffect(() => {
      axios.get(conifgs?.LIVE_BASE_URL +`e-books/list?subject_id=${unitId}`)
      .then(res => {
        console.log(res)
      })
      // dispatch(handleGetAllEbooks({subject_id : id}))
      // .unwrap()
      // .then(res => console.log(res))
    } , [unitId])
  

  return (
    <DigitalLibrary
       id ={unitId}
      subject={selectedSubjectAndUnitWithTopic?.subject}
      // unit={selectedSubjectAndUnitWithTopic?.unit}
      // topic={selectedSubjectAndUnitWithTopic?.topic}
    />
  );
};

export default DigitalLibraryPage;