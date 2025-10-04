
"use client";


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, BarChart3, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

const Educational = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      title: "Teacher's Dashboard",
      subtitle: "Building a quiz in under 2 minutes",
      image: "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202308/ezgif-sixteen_nine_260.jpg?size=948:533",
      description: "Intuitive interface for creating engaging quizzes"
    },
    {
      title: "Student Test Interface",
      subtitle: "Hints & instant feedback",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center",
      description: "Interactive learning with real-time guidance"
    },
    {
      title: "Analytics Charts",
      subtitle: "Class overview & drill-down per student",
      image: "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202308/ezgif-sixteen_nine_260.jpg?size=948:533",
      description: "Comprehensive insights into student performance"
    },
    {
      title: "Mobile Practice",
      subtitle: "Practice on the go",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&crop=center",
      description: "Learn anywhere, anytime with mobile optimization"
    }
  ];

  const testimonials = [
    {
      quote: "This platform transformed our mid-term review—students who scored under 50% improved by 20 points!",
      author: "Dr. Lina Hassan",
      role: "Al Noor Academy",
      rating: 5
    },
    {
      quote: "Assigning quizzes is now a two-click process. Analytics help me tailor my lessons each week.",
      author: "Mr. Omar Fahmy",
      role: "Bright Minds School",
      rating: 5
    }
  ];

  const userTypes = [
    {
      type: "Teachers",
      quote: "I cut grading time in half and immediately know which topics need extra attention.",
      icon: <Users className="w-8 h-8" />,
      color: "from-teal-600 to-teal-700"
    },
    {
      type: "Students", 
      quote: "I love practicing on my phone and seeing exactly where I went wrong.",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-yellow-600 to-yellow-700"
    },
    {
      type: "Admins",
      quote: "Centralized control over users, subscriptions and content quality—no guesswork.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-purple-600 to-purple-700"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: ["1 teacher", "50 students", "Basic analytics"],
      isPopular: false
    },
    {
      name: "Pro",
      price: "$19",
      features: ["Unlimited quizzes", "Detailed analytics", "Priority support"],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: ["Custom integrations", "SSO", "Dedicated account manager"],
      isPopular: false
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F9FAFC' }}>
      {/* Demo Carousel Section */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#202938' }}>
              See It In Action
            </h2>
            <p className="text-xl opacity-70" style={{ color: '#202938' }}>
              Experience the power of our educational platform
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-96 md:h-[500px]">
                <img 
                  src={carouselItems[currentSlide].image}
                  alt={carouselItems[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{carouselItems[currentSlide].title}</h3>
                  <p className="text-xl mb-2">{carouselItems[currentSlide].subtitle}</p>
                  <p className="text-gray-200">{carouselItems[currentSlide].description}</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ color: '#0F7490' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ color: '#0F7490' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-8' : ''
                  }`}
                  style={{ 
                    backgroundColor: index === currentSlide ? '#0F7490' : '#C9AE6C'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#202938' }}>
              Built For Everyone
            </h2>
            <p className="text-xl opacity-70" style={{ color: '#202938' }}>
              Designed to meet the needs of educators, students, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br rounded-2xl h-full p-8 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                     style={{ background: `linear-gradient(135deg, ${user.color === 'from-teal-600 to-teal-700' ? '#0F7490, #0D6B7D' : user.color === 'from-yellow-600 to-yellow-700' ? '#C9AE6C, #B8985F' : '#8B5CF6, #7C3AED'})` }}>
                  <div className="mb-6">
                    {user.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{user.type}</h3>
                  <p className="text-lg leading-relaxed opacity-90">"{user.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-6" style={{ backgroundColor: '#F9FAFC' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#202938' }}>
              What Educators Say
            </h2>
            <p className="text-xl opacity-70" style={{ color: '#202938' }}>
              Real results from real educators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#C9AE6C' }} />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: '#202938' }}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4"
                       style={{ backgroundColor: '#0F7490' }}>
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#202938' }}>{testimonial.author}</p>
                    <p className="text-sm opacity-70" style={{ color: '#202938' }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#202938' }}>
              Choose Your Plan
            </h2>
            <p className="text-xl opacity-70" style={{ color: '#202938' }}>
              Flexible pricing for every educational need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.isPopular 
                  ? 'transform scale-105 shadow-2xl border-2' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
              style={{ 
                backgroundColor: plan.isPopular ? '#0F7490' : 'white',
                borderColor: plan.isPopular ? '#0F7490' : 'transparent',
                color: plan.isPopular ? 'white' : '#202938'
              }}>
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: '#C9AE6C' }}>
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  {plan.price !== 'Contact Us' && <p className="opacity-70">per month</p>}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" 
                                   style={{ color: plan.isPopular ? '#C9AE6C' : '#0F7490' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  plan.isPopular 
                    ? 'bg-white hover:bg-gray-100' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ 
                  color: plan.isPopular ? '#0F7490' : '#202938'
                }}>
                  {plan.price === 'Contact Us' ? 'Get Started' : 'Choose Plan'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center text-lg font-semibold hover:underline transition-all duration-300"
               style={{ color: '#0F7490' }}>
              See full pricing
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Educational;

