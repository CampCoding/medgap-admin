'use client';
import React from "react";
import CreateQuestion from "../../../../../../../../../../components/Questions/CreateQuestion";
import { useParams } from "next/navigation";

const NewQuestionPage = () => {
  const {topicId , unitId , id} = useParams()
  return (
    <div>
      <div className=" rounded shadow space-y-4">
        <CreateQuestion topicId={topicId} unitId={unitId} id={id} />

        {/* {renderForm()} */}
      </div>
    </div>
  );
};

export default NewQuestionPage;
