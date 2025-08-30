import React from "react";

const Map = () => {
  return (
    <section  >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7288541.008329087!2d30.850896000000002!3d26.876255!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14368976c35c36e9%3A0x2c45a00925c4c444!2sEgypt!5e0!3m2!1sen!2sus!4v1753359174511!5m2!1sen!2sus"
       
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-[400px] md:h-[300px] lg:h-[400px]  shadow-2xl"
      />
    </section>
  );
};

export default Map;
