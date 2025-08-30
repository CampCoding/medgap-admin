"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  Sparkles,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      question: "How do group classes work?",
      answer: `
        <div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">We offer a variety of group class programs tailored to different learning goals:</span></p><ol><li><b>Basic Arabic Program</b><span style="font-weight: 400">:</span><span style="font-weight: 400"><br></span><span style="font-weight: 400">Designed for those who want to learn reading, writing, and basic conversational Arabic, perfect for beginners starting their Arabic journey.</span></li><li><b>Conversational Arabic Program</b><span style="font-weight: 400">:</span><span style="font-weight: 400"><br></span><span style="font-weight: 400">Ideal for learners who wish to focus solely on conversational Arabic, starting from an absolute beginner level, even with no prior knowledge of the language.</span></li><li><b>Comprehensive Arabic Program</b><span style="font-weight: 400">:</span><span style="font-weight: 400"><br></span><span style="font-weight: 400">This program provides a full Arabic language learning experience, covering reading, writing, speaking, listening, and translation. It progresses from beginner to advanced levels through seven structured stages.</span></li><li><b>Intermediate and Advanced Conversational Classes</b><span style="font-weight: 400">:</span><span style="font-weight: 400"><br></span><span style="font-weight: 400">We offer dedicated conversational Arabic classes for intermediate and advanced learners to enhance fluency and confidence.</span></li></ol><p><b>Note</b><span style="font-weight: 400"> :Group classes follow a fixed weekly schedule, unlike one-to-one classes, which offer greater flexibility.</span></p>                        </div>
      
      `,
    },
    {
      question: "How can I catch up if I've missed a group class?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">After every session, the </span><b>recorded class</b><span style="font-weight: 400"> will be uploaded, so you’ll always have access to it as a reference — whether you attended the session or not.</span></p><p><span style="font-weight: 400">Additionally, all the materials used during the class, including videos, files, and presentations, will be provided to you. This ensures you have everything you need to review, revise, and stay on track with your learning.</span></p>                        </div>`,
    },
    {
      question: "How do one-to-one classes work?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">Enjoy the benefits of personalized attention with our </span><b>one-on-one classes</b><span style="font-weight: 400">. Here’s how it works:</span></p><ol><li><b>Dedicated Teacher</b><span style="font-weight: 400">: You'll have a teacher focused entirely on your needs and learning style.</span></li><li><b>Free Assessment</b><span style="font-weight: 400">: We start with a free assessment to understand your goals, strengths, and areas for improvement.</span></li><li><b>Customized Learning Plan</b><span style="font-weight: 400">: Based on your assessment, we create a tailored learning plan to help you achieve your objectives effectively.</span></li><li><b>Flexible Scheduling</b><span style="font-weight: 400">: Our flexible schedule allows you to fit lessons into your busy life with ease.</span></li></ol><p><span style="font-weight: 400">Experience a learning journey that’s designed just for you!</span></p>                        </div>`,
    },
    {
      question: "How does the subscription for one-to-one classes work?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">For example, if you subscribe to our </span><b>standard package</b><span style="font-weight: 400"> (8 classes over 4 weeks):</span></p><ul><li><span style="font-weight: 400">This package includes an average of </span><b>2 classes per week</b><span style="font-weight: 400">.</span></li><li><span style="font-weight: 400">However, you have the </span><b>flexibility</b><span style="font-weight: 400"> to schedule and distribute these classes in a way that suits your needs and availability.</span></li></ul><p><span style="font-weight: 400">Our flexible scheduling ensures that your learning experience fits seamlessly into your busy life.</span></p>                        </div>`,
    },
    {
      question: "Which Arabic dialects do you teach?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">We currently offer courses in </span><b>Modern Standard Arabic (MSA)</b><span style="font-weight: 400"> and </span><b>Egyptian Colloquial Arabic (ECA)</b><span style="font-weight: 400">, depending on your learning goals. We believe that tailoring our courses to individual needs is the key to successful language learning.</span></p><p><span style="font-weight: 400">In the near future, we plan to introduce courses in other Arabic dialects to further expand your learning opportunities.</span></p>                        </div>`,
    },
    {
      question: "Should I learn Modern Standard Arabic or Egyptian Dialect?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">This is a great and common question among Arabic learners, and the best choice depends on your personal goals for learning the language. Here's a breakdown to help you decide:</span></p><h4><b>Modern Standard Arabic (MSA):</b></h4><ul><li><b>Usage</b><span style="font-weight: 400">: MSA is the official language across the Arab world. It’s used in books, articles, formal speeches, and religious texts like the Quran.</span></li><li><b>Benefits</b><span style="font-weight: 400">: Learning MSA allows you to understand classical Arabic literature, engage in formal communication (e.g., conferences and events), and read Arabic content across the region.</span></li><li><b>Difficulty</b><span style="font-weight: 400">: It can be more challenging initially, particularly due to its complex grammar and syntax.</span></li></ul><h4><b>Egyptian Dialect (ECA):</b></h4><ul><li><b>Usage</b><span style="font-weight: 400">:</span><span style="font-weight: 400"> Egyptian Arabic is the most widely understood dialect in the Arab world, thanks to its strong presence in media, films, music, and TV series.</span></li><li><b>Benefits</b><span style="font-weight: 400">: Learning Egyptian dialect makes it easier to communicate with Egyptians, immerse yourself in Egyptian culture, and enjoy Egyptian movies, songs, and TV shows.</span></li><li><b>Difficulty</b><span style="font-weight: 400">: It is generally easier to start with compared to MSA, though it differs significantly in grammar, vocabulary, and pronunciation.</span></li></ul><h3><b>My Advice:</b></h3><ul><li><span style="font-weight: 400">If your goal is to </span><b>deepen your understanding of Arabic culture</b><span style="font-weight: 400">, improve your </span><b>reading and writing skills</b><span style="font-weight: 400">, and engage with formal content, </span><b>Modern Standard Arabic</b><span style="font-weight: 400"> is the better choice.</span></li><li><span style="font-weight: 400">If you want to </span><b>communicate in daily conversations</b><span style="font-weight: 400">, explore Egyptian culture, or enjoy media like </span><b>movies and TV shows</b><span style="font-weight: 400">, then </span><b>Egyptian Dialect</b><span style="font-weight: 400"> is more suitable for you.</span></li></ul>                        </div>`,
    },
    {
      question: "Can I ask for a refund?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><span style="font-weight: 400">We do not offer refunds; however, we want to ensure you get the most value from your purchase. Within </span><b>7 days</b><span style="font-weight: 400"> of your subscription, you have the following options:</span></p><ol><li><b>Transfer</b><span style="font-weight: 400">: You can transfer your course subscription to a friend or family member.</span></li></ol><p><b>Exchange</b><span style="font-weight: 400">: You can exchange the course value for another course or use it toward other services we provide.</span></p>                        </div>`,
    },
    {
      question: "Does the course cover cultural aspects of Egyptian life?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">&nbsp;Absolutely! Our courses go beyond language learning to provide you with a deep understanding of </span><b>Egyptian culture and daily life</b><span style="font-weight: 400">. You’ll learn practical expressions, common traditions, and cultural norms that will help you navigate conversations and interactions with locals. We incorporate cultural references, idiomatic expressions, and even insights from Egyptian movies, TV shows, and social media to make the learning experience authentic and engaging.</span></p>                        </div>`,
    },
    {
      question: "Can this course help me prepare for travel or work in Egypt?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">&nbsp;Absolutely! Our courses go beyond language learning to provide you with a deep understanding of </span><b>Egyptian culture and daily life</b><span style="font-weight: 400">. You’ll learn practical expressions, common traditions, and cultural norms that will help you navigate conversations and interactions with locals. We incorporate cultural references, idiomatic expressions, and even insights from Egyptian movies, TV shows, and social media to make the learning experience authentic and engaging.</span></p>                        </div>`,
    },
    {
      question: "What is the duration and structure of the program?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><ul><li><b>One-to-One Classes</b><span style="font-weight: 400">: Each session lasts </span><b>one hour</b><span style="font-weight: 400">, with the option to adjust the session time based on your needs if you’re enrolled in individual programs.</span></li><li><b>Group Classes</b><span style="font-weight: 400">: Each session is </span><b>one and a half hours long</b><span style="font-weight: 400">.</span></li><li><b>Course Duration</b><span style="font-weight: 400">: Typically, each level takes </span><b>6 to 7 months</b><span style="font-weight: 400"> to complete. However, the duration can be adjusted and shortened if you have more time to dedicate to your studies.</span></li></ul><p><span style="font-weight: 400">At our institute, we always appreciate and accommodate your energy, time, and commitment to learning.</span></p>                        </div>`,
    },
    {
      question: "Can you personalize the courses to meet our specific needs?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <h3>&nbsp;</h3><p><b>Absolutely!</b><span style="font-weight: 400"> Our programs are designed to be flexible and adaptable to suit your individual goals and preferences. Here's how:</span></p><ul><li><b>Group Classes:</b><span style="font-weight: 400"> Our structured curriculum is thoughtfully crafted to cover all language skills—speaking, listening, reading, and writing—while catering to diverse learning objectives. Whether you’re aiming to build conversational fluency, enhance your grammar, or achieve specific milestones, you’ll receive expert guidance in a collaborative and engaging environment.</span></li><li><b>Private Lessons:</b><span style="font-weight: 400"> For a fully customized experience, we create a tailored learning plan just for you. These sessions focus intensively on your unique goals, whether it’s mastering day-to-day conversation, preparing for work or study, or addressing specific challenges in learning Arabic.</span></li></ul><p><span style="font-weight: 400">Our highly qualified, certified teachers specialize in teaching Arabic as a foreign language, ensuring you get a professional and personalized learning experience. Whether you prefer group classes or one-on-one sessions, we’re here to maximize your progress and make your learning journey effective and enjoyable!</span></p>                        </div>`,
    },
    {
      question: "What resources and materials will be provided to students?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><b>We offer unique and accredited curricula for teaching the Egyptian dialect, specifically designed to meet the needs of students who want to learn the modern, natural language used daily in Egypt, moving away from outdated or formalized language.</b></p><h3><b>What makes our curriculum stand out?</b></h3><ul><li><b>Exclusive Materials: We use innovative learning materials developed specifically by our academy, including listening scripts, PDF files, and videos inspired by films, TV shows, and social media content.</b></li></ul><ul><li><b>Carefully Designed Curriculum: Each level includes more than 200 audio recordings, focusing on listening and speaking to help you develop your skills in a comprehensive and enjoyable way.</b></li></ul><ul><li><b>Interactive Practice: We offer a variety of fun and engaging exercises that focus on improving your speaking and listening skills effectively.</b></li></ul><ul><li><b>Cairene Dialect: Our curriculum specializes in teaching the Egyptian dialect with a focus on the language spoken by Cairo’s residents, helping you communicate smoothly in everyday life.</b></li></ul><ul><li><b>Living Language Usage: Our lessons are entirely based on the natural, modern language currently used in Egyptian society, ensuring you learn the dialect you will actually hear and use.</b></li></ul><h3><b>Teaching Methods:</b></h3><ul><li><b>Interactive Activities: To motivate speaking and listening in an engaging way.</b></li></ul><ul><li><b>Multimedia Resources: Including recordings, videos, and authentic texts.</b></li></ul><ul><li><b>Targeted Exercises: Focused on developing speaking and listening skills to ensure fast and effective results.</b></li></ul><p><b>We provide a fun and comprehensive learning experience that prepares you to use the Egyptian dialect with ease and confidence in your daily life!</b></p>                        </div>`,
    },
    {
      question: "How many students are there in a group class?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">Our group classes are designed to maintain an optimal learning environment. Each class typically includes a minimum of 3 students and a maximum of 6 students. This ensures a highly interactive experience, giving each participant plenty of opportunities to engage, practice speaking, and receive personalized attention from the teacher.</span></p><p><b>Are the materials used in the course included in the subscription, or is there an additional fee for them?</b></p><p><span style="font-weight: 400">All course materials are fully included in the subscription.&nbsp;</span></p><p><span style="font-weight: 400">There are no additional fees for the learning materials, which include audio recordings, PDF files, videos, and interactive activities. Everything you need to succeed in your learning journey is provided as part of the course package.</span></p>                        </div>`,
    },
    {
      question:
        "Who teaches at the academy, and are the teachers native Arabic speakers?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">&nbsp;All our teachers at the academy are highly qualified native Arabic speakers with professional certification and extensive experience in teaching Arabic as a foreign language. For the Egyptian dialect courses, all our teachers are Egyptian natives, ensuring that students learn from experts who are not only fluent in the language but also deeply familiar with the cultural and social context of Egypt.</span></p><p><span style="font-weight: 400">Our instructors are passionate about teaching and are skilled in guiding students to master the Egyptian dialect with confidence. They focus on practical, real-life language usage, providing an authentic and engaging learning experience tailored to each student's goals.</span></p><p><b>Are the lessons live or pre-recorded?</b></p><p><span style="font-weight: 400">&nbsp;Our lessons are primarily </span><b>live and fully interactive</b><span style="font-weight: 400">, allowing students to engage directly with their teacher and classmates in real-time. This interactive approach ensures immediate feedback and personalized support.</span></p><p><span style="font-weight: 400">Additionally, all live sessions are </span><b>recorded and made available</b><span style="font-weight: 400"> to students, so you can review the material at your convenience or catch up on any missed classes. This combination of live interaction and recorded accessibility provides the flexibility to learn at your own pace while staying connected to the classroom experience.</span></p>                        </div>`,
    },
    {
      question:
        "Can I enroll in the course and watch the recordings as if it were a pre-recorded course?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">Yes, you can! If you prefer to follow the course by watching the recorded sessions, you are welcome to do so. All live lessons are recorded and made available for you to access at your convenience. This allows you to learn at your own pace while still benefiting from the comprehensive curriculum and high-quality materials provided in the course. However, we highly encourage attending live sessions whenever possible for the added advantage of real-time interaction and personalized support from our teachers.</span></p>                        </div>`,
    },
    {
      question: "Can I switch from group classes to private lessons later?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">Yes, absolutely! We understand that your learning needs may change, so we offer the flexibility to transition from group classes to private lessons at any point during the course. This allows you to focus on personalized goals and enjoy one-on-one attention from your teacher.</span></p><p><span style="font-weight: 400">Our team will work with you to ensure a smooth transition and design a tailored learning plan that aligns with your objectives, whether you’re looking to accelerate your progress or focus on specific areas of improvement.</span></p>                        </div>`,
    },
    {
      question: "How long will it take me to become fluent?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><b>A:</b><span style="font-weight: 400"> The time it takes to become fluent in Egyptian Arabic depends on several factors, including your starting level, the time you dedicate to practice, and your exposure to the language outside of classes.</span></p><p><span style="font-weight: 400">In our structured program:</span></p><ul><li><b>Each level typically takes 6 to 7 months</b><span style="font-weight: 400"> to complete, with two sessions per week.</span></li><li><span style="font-weight: 400">After completing </span><b>Level 1 and Level 2</b><span style="font-weight: 400">, most students achieve a strong conversational level, enabling them to confidently navigate everyday situations and engage in meaningful conversations.</span></li></ul><p><span style="font-weight: 400">To reach full fluency, we recommend consistent practice, participation in speaking activities, and immersing yourself in the language through listening to native speakers, watching Egyptian media, and applying what you learn in real-life scenarios. Our courses are designed to accelerate your progress and bring you closer to fluency with every session.</span></p>                        </div>`,
    },
    {
      question: "What payment methods do you accept?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><b>A:</b><span style="font-weight: 400"> We offer a variety of secure and convenient payment methods to suit your needs, including:</span></p><ul><li><b>Credit/Debit Cards:</b><span style="font-weight: 400"> All major cards are accepted.</span></li><li><b>PayPal:</b><span style="font-weight: 400"> For international payments.</span></li><li><b>Bank Transfers:</b><span style="font-weight: 400"> Available upon request for certain regions.</span></li><li><b>Digital Wallets:</b><span style="font-weight: 400"> Depending on availability in your region.</span></li><li><b>Money Transfer Applications:</b><span style="font-weight: 400"> Such as </span><b>Western Union</b><span style="font-weight: 400">, </span><b>Ria</b><span style="font-weight: 400">, and </span><b>MoneyGram</b><span style="font-weight: 400">, for easy international payments.</span></li></ul><p><span style="font-weight: 400">If you have specific requirements or prefer a different payment method, please feel free to contact us, and we will do our best to accommodate your needs.</span></p>                        </div>`,
    },
    {
      question: "How do I contact the academy if I have questions?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><b>A:</b><span style="font-weight: 400"> You can reach out to us through multiple channels:</span></p><ul><li><b>Email:</b><span style="font-weight: 400"> Send us an email at [your email address], and we’ll respond promptly.</span></li><li><b>Phone/WhatsApp:</b><span style="font-weight: 400"> Call or message us at [your phone/WhatsApp number] for direct communication.</span></li><li><b>Social Media:</b><span style="font-weight: 400"> Connect with us on [list your social media platforms, e.g., Instagram, Facebook, etc.] for updates and inquiries.</span></li><li><b>Contact Form:</b><span style="font-weight: 400"> Use the contact form on our website to submit your questions, and our team will get back to you as soon as possible.</span></li></ul><p><span style="font-weight: 400">Our support team is always ready to assist you with any inquiries or concerns you may have!</span></p>                        </div>`,
    },
    {
      question: "What is the cost of the courses?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p><span style="font-weight: 400">&nbsp;The cost of our courses varies depending on the program you choose (group classes or private lessons) and the course duration. For detailed pricing information, please contact us directly, and we’ll provide a tailored quote based on your preferences and learning needs.</span></p><p><span style="font-weight: 400">We also offer:</span></p><ul><li><b>Flexible payment options:</b><span style="font-weight: 400"> Including installment plans to make learning more accessible.</span></li><li><b>Discounts:</b><span style="font-weight: 400"> For enrolling in multiple levels or referring a friend.</span></li></ul><p><span style="font-weight: 400">Our courses are competitively priced to ensure you receive high-quality education and value for your investment. Feel free to reach out for more details!</span></p>                        </div>
                            `,
    },
    {
      question: "Are there any homework or post-class activities?",
      answer: `<div class="elementskit-card-body ekit-accordion--content">
                            <p>&nbsp;</p><p>Yes, every lesson includes <b>homework assignments and post-class activities</b> to help reinforce your learning and improve your skills. These activities are carefully designed to focus on key areas such as speaking, listening, reading, and writing.</p><p>Some examples of the tasks you can expect include:</p><ul><li><b>Listening Practice:</b> Engaging with audio recordings to enhance comprehension.</li><li><b>Speaking Exercises:</b> Role-playing scenarios or practicing phrases to boost fluency.</li><li><b>Vocabulary and Grammar Tasks:</b> Targeted exercises to solidify understanding.</li><li><b>Interactive Activities:</b> Fun and practical tasks designed to connect lessons with real-life situations.</li></ul><p>Our goal is to ensure that you continue learning and practicing between classes, making steady progress while keeping the experience enjoyable and productive!</p>                        </div>`,
    },
  ];

  const filteredFAQ = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-[#0d645e] rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-6 leading-tight">
            Frequently Asked
            <span className="block bg-gradient-to-r from-primary to-[#0d645e] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-secborder-secondary max-w-2xl mx-auto">
            Everything you need to know about our product. Can't find what
            you're looking for?
            <span className="text-primary font-semibold">
              {" "}
              Chat with our team
            </span>
            .
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-primary rounded-2xl text-primary placeholder-primary focus:outline-none focus:ring-2 focus:ring-secborder-secondary focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* FAQ Items */}
        <div className="columns-1 md:columns-2  mx-auto gap-4 space-y-4">
          {filteredFAQ.map((item, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-sm border border-primary rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/15 hover:border-secondary ${
                openIndex === index
                  ? "!shadow-2xl bg-secborder-secondary  border-secondary text-white shadow-purple-500/20"
                  : ""
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left focus:outline-none group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black group-hover:text-secborder-secondary transition-colors duration-300">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-secborder-secondary transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <div
                className={`overflow-auto transition-all duration-500 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.answer && (
                  <div
                    className="px-6 pb-6 text-black"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQ.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-blue-200">
              Try adjusting your search terms or browse all questions above.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center ">
          <div className="bg-teal-500 text-white py-6 px-4 md:px-12 shadow-md relative overflow-hidden rounded-xl">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-teal-400 rounded-l-full opacity-60">
              <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-dashed border-white rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-blck/90 mb-6">
              Our team is here to help you succeed. Get in touch and we'll
              respond within minutes.
            </p>
            <button className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-secondary hover:text-white transition-colors duration-300 shadow-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
