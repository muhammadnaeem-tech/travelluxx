import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
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
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => { if (!data.error) setPage(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (page) {
      document.title = page.metaTitle || page.title || "Travelluxx";
      
      const meta = document.querySelector("meta[name='description']");
      if (meta) {
        meta.setAttribute("content", page.metaDescription || "");
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "description");
        newMeta.setAttribute("content", page.metaDescription || "");
        document.head.appendChild(newMeta);
      }

      // Update robots meta tag
      let robotsMeta = document.querySelector("meta[name='robots']");
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      const isNoIndex = !!settings?.search_engine_visibility || !!page.noIndexNoFollow;
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
      updateMetaProp("og:title", page.metaTitle || page.title || "");
      updateMetaProp("og:description", page.metaDescription || "");
      updateMetaProp("twitter:title", page.metaTitle || page.title || "");
      updateMetaProp("twitter:description", page.metaDescription || "");

      // Inject JSON-LD Schema
      const existingScript = document.getElementById("jsonld-page-schema");
      if (existingScript) existingScript.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": page.template === "About Page" ? "AboutPage" : page.template === "Contact Page" ? "ContactPage" : "WebPage",
        "name": page.title,
        "description": page.metaDescription || "",
        "url": window.location.href,
        "publisher": {
          "@type": "Organization",
          "name": settings?.business_name || "Travelluxx",
          "logo": settings?.logo_image ? {
            "@type": "ImageObject",
            "url": settings.logo_image
          } : undefined
        }
      };

      const script = document.createElement("script");
      script.id = "jsonld-page-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById("jsonld-page-schema");
      if (existingScript) existingScript.remove();
    };
  }, [page, settings]);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      <Navbar onScrollTo={() => {}} />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading page...</div>
        ) : !page ? (
          <div className="text-center py-20 text-slate-400">Page not found.</div>
        ) : (
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{page.title}</h1>
            <div
              className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        )}
      </main>
      <Footer onScrollTo={() => {}} />
    </div>
  );
}
