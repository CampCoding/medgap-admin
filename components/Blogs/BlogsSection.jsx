import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Star,
  ArrowRight,
  Bookmark,
  PlayCircle,
  Headphones,
  Globe,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export default function BlogsSection() {
  const [likedCards, setLikedCards] = useState(new Set());
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Arabic Phrases Every Beginner Should Know",
      titleArabic: "عشر عبارات أساسية في اللغة العربية",
      excerpt: "Master these fundamental phrases and start your Arabic journey with confidence. Perfect for absolute beginners.",
      author: "Dr. Amina Hassan",
      authorArabic: "د. أمينة حسن",
      date: "March 15, 2024",
      readTime: "5 min read",
      views: "2.3k",
      likes: 89,
      comments: 23,
      category: "Beginner",
      categoryColor: "from-green-400 to-emerald-500",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      icon: BookOpen,
      trending: true
    },
    {
      id: 2,
      title: "The Art of Arabic Calligraphy: A Visual Journey",
      titleArabic: "فن الخط العربي: رحلة بصرية",
      excerpt: "Explore the mesmerizing world of Arabic calligraphy and its profound cultural significance throughout history.",
      author: "Ahmed Al-Khattat",
      authorArabic: "أحمد الخطاط",
      date: "March 12, 2024",
      readTime: "8 min read",
      views: "4.1k",
      likes: 156,
      comments: 45,
      category: "Culture",
      categoryColor: "from-purple-400 to-indigo-500",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      gradient: "from-purple-400 via-indigo-500 to-blue-600",
      icon: Sparkles,
      featured: true
    },
    {
      id: 3,
      title: "Advanced Grammar: Mastering Arabic Verb Conjugations",
      titleArabic: "القواعد المتقدمة: إتقان تصريف الأفعال العربية",
      excerpt: "Dive deep into Arabic verb patterns and conjugations with practical examples and memory techniques.",
      author: "Prof. Sarah Mahmoud",
      authorArabic: "أ. سارة محمود",
      date: "March 10, 2024",
      readTime: "12 min read",
      views: "1.8k",
      likes: 67,
      comments: 31,
      category: "Advanced",
      categoryColor: "from-red-400 to-pink-500",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      gradient: "from-red-400 via-pink-500 to-rose-600",
      icon: Award,
      hasAudio: true
    },
    {
      id: 4,
      title: "Arabic Pronunciation Guide: Perfect Your Accent",
      titleArabic: "دليل النطق العربي: أتقن لهجتك",
      excerpt: "Learn the secrets of authentic Arabic pronunciation with audio examples and phonetic breakdowns.",
      author: "Layla Qasemi",
      authorArabic: "ليلى قاسمي",
      date: "March 8, 2024",
      readTime: "6 min read",
      views: "3.2k",
      likes: 124,
      comments: 18,
      category: "Pronunciation",
      categoryColor: "from-orange-400 to-yellow-500",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
      gradient: "from-orange-400 via-yellow-500 to-amber-600",
      icon: Headphones,
      hasVideo: true
    },
    {
      id: 5,
      title: "Exploring Arabic Literature: Poetry Through the Ages",
      titleArabic: "استكشاف الأدب العربي: الشعر عبر العصور",
      excerpt: "Journey through centuries of Arabic poetry, from pre-Islamic verse to contemporary masterpieces.",
      author: "Dr. Omar Farid",
      authorArabic: "د. عمر فريد",
      date: "March 5, 2024",
      readTime: "10 min read",
      views: "2.7k",
      likes: 98,
      comments: 27,
      category: "Literature",
      categoryColor: "from-teal-400 to-cyan-500",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      gradient: "from-teal-400 via-cyan-500 to-blue-600",
      icon: Globe,
      premium: true
    },
    {
      id: 6,
      title: "Business Arabic: Professional Communication Skills",
      titleArabic: "العربية التجارية: مهارات التواصل المهني",
      excerpt: "Master formal Arabic for business contexts, emails, presentations, and professional networking.",
      author: "Khalid Al-Mansouri",
      authorArabic: "خالد المنصوري",
      date: "March 3, 2024",
      readTime: "7 min read",
      views: "1.9k",
      likes: 73,
      comments: 15,
      category: "Business",
      categoryColor: "from-indigo-400 to-purple-500",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      gradient: "from-indigo-400 via-purple-500 to-violet-600",
      icon: TrendingUp,
      new: true
    }
  ];

  const toggleLike = (cardId) => {
    setLikedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (cardId) => {
    setBookmarkedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Arabic Learning Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8">مدونة تعلم اللغة العربية</p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${
                hoveredCard === post.id ? 'z-10' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(post.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Floating Elements */}
              {hoveredCard === post.id && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-float opacity-30"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-teal-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Special Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
                {post.trending && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    <TrendingUp className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}
                {post.featured && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Featured</span>
                  </div>
                )}
                {post.new && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                    New
                  </div>
                )}
                {post.premium && (
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Premium
                  </div>
                )}
              </div>

              {/* Media Icons */}
              <div className="absolute top-4 right-4 z-20 flex space-x-2">
                {post.hasVideo && (
                  <div className="p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full">
                    <PlayCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {post.hasAudio && (
                  <div className="p-2 bg-black bg-opacity-50 backdrop-blur-sm rounded-full">
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className={`flex items-center space-x-2 bg-gradient-to-r ${post.categoryColor} text-white px-4 py-2 rounded-full shadow-lg`}>
                    <post.icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{post.category}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-10">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                
                {/* Arabic Title */}
                <p className="text-right text-teal-600 font-semibold mb-3 font-arabic">
                  {post.titleArabic}
                </p>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{post.author}</p>
                    <p className="text-xs text-teal-600 font-arabic">{post.authorArabic}</p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-1 transition-all duration-300 ${
                        likedCards.has(post.id)
                          ? 'text-red-500 scale-110'
                          : 'text-gray-400 hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedCards.has(post.id) ? 'fill-red-500' : ''}`} />
                      <span className="text-sm">{post.likes + (likedCards.has(post.id) ? 1 : 0)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors duration-300">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button className="text-gray-400 hover:text-green-500 transition-colors duration-300">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        bookmarkedCards.has(post.id)
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'hover:bg-gray-100 text-gray-400 hover:text-yellow-600'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedCards.has(post.id) ? 'fill-yellow-600' : ''}`} />
                    </button>
                    
                    <button className="group flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 hover:shadow-lg">
                      <span className="text-sm font-semibold">Read</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-teal-400 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {/* <div className="text-center mt-12">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-3">
              <span>Load More Articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </button>
        </div> */}
      </div>

      <style jsx>{`
        @font-face {
          font-family: 'Arabic';
          src: url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        }
        .font-arabic {
          font-family: 'Amiri', serif;
          direction: rtl;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}