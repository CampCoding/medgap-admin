import React from "react";

const CheckBox = ({checked , onChange  = () => null}) => {
  return (
    <div class="content">
      <label class="checkBox">
        <input id="ch1" type="checkbox" onChange={onChange} checked={checked} />
        <div class="transition"></div>
      </label>
    </div>
  );
};

export default CheckBox;
