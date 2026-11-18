import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => { if (!data.error) setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  // Set SEO meta tags and Schema
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || post.title || "Blog | Travelluxx";
      const meta = document.querySelector("meta[name='description']");
      if (meta) {
        meta.setAttribute("content", post.metaDescription || post.excerpt || "");
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "description");
        newMeta.setAttribute("content", post.metaDescription || post.excerpt || "");
        document.head.appendChild(newMeta);
      }

      // Update robots meta tag
      let robotsMeta = document.querySelector("meta[name='robots']");
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      const isNoIndex = !!settings?.search_engine_visibility || !!post.noIndexNoFollow;
      robotsMeta.setAttribute("content", isNoIndex ? "noindex, nofollow" : "index, follow");

      // Update OG and Twitter meta tags
      const updateMetaProp = (prop: string, content: string) => {
        let el = document.querySelector(`meta[property='${prop}']`);
        if (el) {
          el.setAttribute("content", content);
        } else {
          el = document.createElement("meta");
          el.setAttribute("property", prop);
          el.setAttribute("content", content);
          document.head.appendChild(el);
        }
      };
      updateMetaProp("og:title", post.metaTitle || post.title || "");
      updateMetaProp("og:description", post.metaDescription || post.excerpt || "");
      if (post.image) updateMetaProp("og:image", post.image);
      updateMetaProp("twitter:title", post.metaTitle || post.title || "");
      updateMetaProp("twitter:description", post.metaDescription || post.excerpt || "");
      if (post.image) updateMetaProp("twitter:image", post.image);

      // Inject JSON-LD Schema
      const existingScript = document.getElementById("jsonld-post-schema");
      if (existingScript) existingScript.remove();

      const schemas: any[] = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "image": post.image || "",
          "datePublished": post.date || "",
          "author": {
            "@type": "Person",
            "name": post.author || "Travelluxx Editorial"
          },
          "publisher": {
            "@type": "Organization",
            "name": settings?.business_name || "Travelluxx",
            "logo": settings?.logo_image ? {
              "@type": "ImageObject",
              "url": settings.logo_image
            } : undefined
          },
          "description": post.excerpt || post.metaDescription || ""
        }
      ];

      if (post.faqs && post.faqs.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        });
      }

      const script = document.createElement("script");
      script.id = "jsonld-post-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById("jsonld-post-schema");
      if (existingScript) existingScript.remove();
    };
  }, [post, settings]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] flex flex-col font-sans antialiased">
      <Navbar onScrollTo={(id) => {
        if (id === "hero" || !id) {
          window.location.href = "/";
        }
      }} />

      <main className="flex-1 w-full py-8 md:py-16">
        {loading ? (
          <div className="text-center py-32 text-slate-400 font-sans">Loading article...</div>
        ) : !post ? (
          <div className="text-center py-32 max-w-md mx-auto px-6">
            <p className="text-2xl font-serif text-slate-800 mb-4">Article Not Found</p>
            <Link to="/blog" className="text-emerald-700 hover:text-emerald-800 underline font-semibold text-sm">← Back to Blog</Link>
          </div>
        ) : (
          <article className="w-full">
            {/* Header Section */}
            <div className="max-w-3xl mx-auto px-4 md:px-6 text-center mb-8 md:mb-12">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold mb-4">
                {post.date ? new Date(post.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-normal text-slate-900 leading-tight tracking-tight mb-6">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <span>By {post.author || "Travelluxx Editorial"}</span>
                <span>•</span>
                <span>Chauffeur &amp; Travel Guides</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="max-w-4xl mx-auto px-4 md:px-6 mb-10 md:mb-14">
                <div className="aspect-[21/9] w-full overflow-hidden rounded shadow-sm bg-slate-100">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 md:px-6">
              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-slate-500 text-lg md:text-xl font-light italic leading-relaxed mb-8 border-l-2 border-emerald-600 pl-4">
                  {post.excerpt}
                </div>
              )}

              {/* Rich Body Content */}
              <div
                className="article-body-content font-serif text-[17px] md:text-[19px] text-[#292929] leading-relaxed space-y-6"
                style={{
                  lineHeight: "1.8",
                  letterSpacing: "-0.003em"
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="font-serif text-2xl font-semibold mb-6 text-slate-900">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {post.faqs.map((faq: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200/60 hover:border-emerald-200 p-5 rounded-xl transition duration-300 hover:shadow-md hover:shadow-emerald-600/5 group"
                      >
                        <h3 className="font-sans text-base font-semibold text-slate-800 group-hover:text-emerald-700 transition duration-300 mb-2">{faq.question}</h3>
                        <p className="font-serif text-slate-600 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-slate-200 text-center">
                <Link to="/blog" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-sm transition">
                  ← Back to Articles
                </Link>
              </div>
            </div>
          </article>
        )}
      </main>

      {/* Inject custom global CSS to format all standard HTML elements from backend text editors */}
      <style>{`
        .article-body-content {
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: normal !important;
        }
        .article-body-content p {
          margin-bottom: 1.5rem;
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: normal !important;
        }
        .article-body-content h2 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        @media (min-width: 768px) {
          .article-body-content h2 {
            font-size: 1.8rem;
          }
        }
        .article-body-content h3 {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        @media (min-width: 768px) {
          .article-body-content h3 {
            font-size: 1.5rem;
          }
        }
        .article-body-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .article-body-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .article-body-content li {
          margin-bottom: 0.5rem;
        }
        .article-body-content a {
          color: #047857;
          text-decoration: underline;
        }
        .article-body-content a:hover {
          color: #065f46;
        }
        .article-body-content blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1.25rem;
          font-style: italic;
          color: #4b5563;
          margin: 1.5rem 0;
        }
        .article-body-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
      `}</style>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
