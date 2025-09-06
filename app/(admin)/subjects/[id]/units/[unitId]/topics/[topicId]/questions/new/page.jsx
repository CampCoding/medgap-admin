import React from "react";
import CreateQuestion from "../../../../../../../../../../components/Questions/CreateQuestion";

const NewQuestionPage = () => {
  return (
    <div>
      <div className=" rounded shadow space-y-4">
        <CreateQuestion />

        {/* {renderForm()} */}
      </div>
    </div>
  );
};

export default NewQuestionPage;
