import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, LayoutDashboard, FileText, Newspaper, Menu, Image, Settings, BookOpen, LogOut, Plus, Trash2, Edit2, Save, X, Upload, Check, ChevronUp, ChevronDown, ExternalLink, Users, MessageSquare } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "dashboard" | "leads" | "posts" | "pages" | "media" | "menus" | "settings" | "inquiries";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
};

// Yoast SEO Box Component
function YoastSeoBox({
  tab,
  setTab,
  focusKeyphrase,
  setFocusKeyphrase,
  title,
  slug,
  metaTitle,
  metaDescription,
  contentType,
  image,
  excerpt,
  onMetaTitleChange,
  onSlugChange,
  onMetaDescriptionChange
}: {
  tab: "seo" | "readability" | "schema" | "social";
  setTab: (t: "seo" | "readability" | "schema" | "social") => void;
  focusKeyphrase: string;
  setFocusKeyphrase: (v: string) => void;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentType: "post" | "page";
  image?: string;
  excerpt?: string;
  onMetaTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
}) {
  const finalTitle = metaTitle || title || "Please enter a title";
  const finalSlug = slug || "slug-url";
  const finalDesc = metaDescription || "Please provide a meta description by editing the SEO settings below to see how this page will look in Google.";

  // Simple SEO checks
  const keyphraseInTitle = focusKeyphrase ? finalTitle.toLowerCase().includes(focusKeyphrase.toLowerCase()) : false;
  const keyphraseInSlug = focusKeyphrase ? finalSlug.toLowerCase().includes(focusKeyphrase.replace(/\s+/g, '-').toLowerCase()) : false;
  const descriptionLengthOk = finalDesc.length > 50;

  return (
    <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm mt-6">
      {/* Title */}
      <div className="border-b border-[#f0f0f1] px-4 py-2.5 bg-[#f6f7f7]">
        <h3 className="font-semibold text-xs text-[#2c3338]">Yoast SEO</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#c3c4c7] bg-[#f6f7f7] text-xs">
        {[
          { id: "seo", label: "SEO", color: focusKeyphrase ? "bg-green-600" : "bg-red-500" },
          { id: "readability", label: "Readability", color: "bg-green-600" },
          { id: "schema", label: "Schema", color: "bg-blue-500" },
          { id: "social", label: "Social", color: "bg-[#2271b1]" }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 font-semibold transition border-r border-[#c3c4c7] flex items-center gap-1.5 ${tab === t.id ? "bg-white border-b-2 border-b-[#2271b1] text-black" : "text-[#50575e] hover:bg-slate-100"}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 text-xs text-[#2c3338] space-y-5">
        {tab === "seo" && (
          <div className="space-y-4">
            {/* Focus Keyphrase */}
            <div>
              <label className="block text-[11px] font-semibold text-[#646970] mb-1.5 uppercase tracking-wide">Focus keyphrase</label>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Enter focus keyphrase..."
                  value={focusKeyphrase}
                  onChange={e => setFocusKeyphrase(e.target.value)}
                  className="flex-1 border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                />
                <button type="button" className="border border-[#c3c4c7] hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold rounded-sm transition">
                  Get related keyphrases
                </button>
              </div>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="border border-[#c3c4c7] p-4 rounded bg-white max-w-xl">
              <span className="text-[10px] font-semibold text-[#646970] uppercase block mb-2">Google Snippet Preview</span>
              <div className="space-y-1">
                <div className="text-[11px] text-[#202124] flex items-center gap-1.5">
                  <span className="bg-[#f1f3f4] rounded-full p-1 w-5 h-5 flex items-center justify-center text-[9px] font-bold text-[#5f6368]">T</span>
                  <span className="truncate">{window.location.origin}/{contentType === "post" ? "blog" : "page"}/{finalSlug}</span>
                </div>
                <div className="text-[19px] text-[#1a0dab] font-semibold hover:underline cursor-pointer truncate leading-tight font-sans">
                  {finalTitle}
                </div>
                <p className="text-[13px] text-[#4d5156] leading-relaxed break-all font-sans">
                  {finalDesc}
                </p>
              </div>
            </div>

            {/* Google Snippet Fields Under the Preview */}
            <div className="space-y-3 pt-2 max-w-xl border-t border-[#f0f0f1]">
              <div>
                <label className="block text-[11px] font-semibold text-[#646970] mb-1 uppercase tracking-wide">SEO title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={e => onMetaTitleChange(e.target.value)}
                  placeholder="Enter custom SEO title..."
                  className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#646970] mb-1 uppercase tracking-wide">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => onSlugChange(e.target.value)}
                  placeholder="Enter URL slug..."
                  className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#646970] mb-1 uppercase tracking-wide">Meta description</label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={e => onMetaDescriptionChange(e.target.value)}
                  placeholder="Enter custom meta description..."
                  className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                />
              </div>
            </div>

            {/* SEO Analysis */}
            <div className="border-t border-[#f0f0f1] pt-4">
              <h4 className="font-bold text-xs text-[#2c3338] mb-3">SEO Analysis</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${focusKeyphrase ? "bg-green-600" : "bg-red-500"}`} />
                  <span>Focus keyphrase: {focusKeyphrase ? `Set as "${focusKeyphrase}"` : "Not set yet"}</span>
                </li>
                {focusKeyphrase && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${keyphraseInTitle ? "bg-green-600" : "bg-red-500"}`} />
                      <span>Focus keyphrase in SEO Title: {keyphraseInTitle ? "Yes, matches perfectly!" : "No, your focus keyphrase was not found in the SEO title."}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${keyphraseInSlug ? "bg-green-600" : "bg-red-500"}`} />
                      <span>Focus keyphrase in URL Slug: {keyphraseInSlug ? "Yes, matches perfectly!" : "No, your focus keyphrase was not found in the URL slug."}</span>
                    </li>
                  </>
                )}
                <li className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${descriptionLengthOk ? "bg-green-600" : "bg-red-500"}`} />
                  <span>Meta description length: {descriptionLengthOk ? "Good length!" : "Too short or empty. Add description above to optimize snippet."}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {tab === "readability" && (
          <div className="space-y-2">
            <h4 className="font-bold text-xs mb-2">Readability Analysis</h4>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
              <span>Flesch Reading Ease: 70.4 (Easy to read)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
              <span>Consecutive sentences: Good variety!</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
              <span>Paragraph length: Well structured!</span>
            </div>
          </div>
        )}

        {tab === "schema" && (
          <div className="space-y-4 max-w-2xl text-xs text-[#2c3338]">
            <div className="flex items-center gap-1.5 text-[#2c3338]">
              <span>Determine how your content should look on search results page using schema.org</span>
              <button type="button" className="text-[#646970] hover:text-[#2c3338]" title="Learn more about schema.org settings">
                <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </button>
            </div>
            
            <div className="bg-[#f6f7f7] border border-[#c3c4c7] p-5 rounded-sm space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#2c3338] mb-1.5">Page type</label>
                <select className="w-full max-w-md border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]">
                  <option value="default_webpage">Default for Posts (Web Page)</option>
                  <option value="webpage">Web Page</option>
                  <option value="itempage">Item Page</option>
                  <option value="aboutpage">About Page</option>
                  <option value="faqpage">FAQ Page</option>
                  <option value="qapage">QA Page</option>
                  <option value="profilepage">Profile Page</option>
                  <option value="contactpage">Contact Page</option>
                  <option value="medicalpage">Medical Web Page</option>
                  <option value="collectionpage">Collection Page</option>
                  <option value="checkoutpage">Checkout Page</option>
                  <option value="realestate">Real Estate Listing</option>
                  <option value="searchresults">Search Results Page</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2c3338] mb-1.5">Article type</label>
                <select className="w-full max-w-md border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]">
                  <option value="default_article">Default for Posts (Article)</option>
                  <option value="article">Article</option>
                  <option value="blogpost">Blog Post</option>
                  <option value="newsarticle">News Article</option>
                  <option value="techarticle">Tech Article</option>
                  <option value="report">Report</option>
                  <option value="scholarly">Scholarly Article</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-[#646970] mt-2">
              You can change the default type for Posts under Content types in the <span className="text-[#2271b1] cursor-pointer hover:underline">Settings</span>.
            </p>
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-6 max-w-2xl text-xs text-[#2c3338]">
            {/* Social Media Appearance Accordion */}
            <div className="border border-[#c3c4c7] rounded-sm bg-white overflow-hidden shadow-sm">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex items-center justify-between font-semibold text-sm cursor-pointer select-none">
                <span className="text-[#2c3338]">Social media appearance</span>
                <ChevronUp className="w-4 h-4 text-[#646970]" />
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[#646970] text-[11px] leading-relaxed">
                  Determine how your post should look on social media like Facebook, X, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.
                </p>

                {/* Social Share Preview Box */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#646970] uppercase mb-1.5 tracking-wide">Social share preview</span>
                  <div className="border border-[#c3c4c7] rounded-sm bg-white overflow-hidden max-w-lg shadow-sm">
                    {image ? (
                      <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-100 border-b border-[#e5e7eb]">
                        <img src={image} alt="Social preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[1.91/1] w-full bg-[#f3f4f6] border-b border-[#e5e7eb] flex items-center justify-center text-slate-400">
                        No image set
                      </div>
                    )}
                    <div className="p-3 bg-[#f2f3f5] font-sans text-xs">
                      <div className="text-[10px] text-[#606770] uppercase tracking-wide">travelluxx.co.uk</div>
                      <div className="font-semibold text-[#1d2129] mt-1 text-sm line-clamp-1">
                        {title || (contentType === "post" ? "Post Title" : "Page Title")}
                      </div>
                      <div className="text-[#606770] mt-0.5 line-clamp-2 leading-relaxed">
                        {excerpt || (contentType === "post" ? "Post excerpt..." : "Page description...")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Image Selection */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#646970] uppercase mb-1.5 tracking-wide">Social image</span>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border border-dashed border-[#8c8f94] bg-slate-50 flex items-center justify-center rounded-sm">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <button type="button" className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 px-3 py-1.5 rounded-sm font-semibold transition bg-white">
                      Select image
                    </button>
                  </div>
                </div>

                {/* Social Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="block text-[11px] font-semibold text-[#646970] uppercase tracking-wide">Social title</span>
                    <div className="flex gap-2">
                      <button type="button" className="text-[#2271b1] hover:underline font-semibold text-[10px]">Insert variable</button>
                      <button type="button" className="text-[#7200e6] hover:underline font-semibold text-[10px] flex items-center gap-0.5">✨ Generate social title</button>
                    </div>
                  </div>
                  <input type="text" className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] focus:outline-none focus:border-[#2271b1]" />
                </div>

                {/* Social Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="block text-[11px] font-semibold text-[#646970] uppercase tracking-wide">Social description</span>
                    <div className="flex gap-2">
                      <button type="button" className="text-[#2271b1] hover:underline font-semibold text-[10px]">Insert variable</button>
                      <button type="button" className="text-[#7200e6] hover:underline font-semibold text-[10px] flex items-center gap-0.5">✨ Generate social description</button>
                    </div>
                  </div>
                  <textarea rows={3} className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] focus:outline-none focus:border-[#2271b1]" />
                </div>
              </div>
            </div>

            {/* X appearance Accordion */}
            <div className="border border-[#c3c4c7] rounded-sm bg-white overflow-hidden shadow-sm">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex items-center justify-between font-semibold text-sm cursor-pointer select-none">
                <span className="text-[#2c3338]">X appearance</span>
                <ChevronUp className="w-4 h-4 text-[#646970]" />
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[#646970] text-[11px] leading-relaxed">
                  To customize the appearance of your post specifically for X, please fill out the 'X appearance' settings below. If you leave these settings untouched, the 'Social media appearance' settings mentioned above will also be applied for sharing on X.
                </p>

                {/* X Share Preview */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#646970] uppercase mb-1.5 tracking-wide">X share preview</span>
                  <div className="border border-[#c3c4c7] rounded-sm aspect-[1.91/1] bg-slate-50 relative flex items-center justify-center overflow-hidden max-w-lg">
                    <div className="text-center p-4">
                      <button type="button" className="bg-[#f0b01c] hover:bg-[#e0a010] text-[#1d2327] px-4 py-2 rounded-sm font-semibold flex items-center gap-2 shadow-sm transition">
                        <span>🔒</span> Unlock with Yoast SEO Premium
                      </button>
                    </div>
                  </div>
                </div>

                {/* X Image Selection */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#646970] uppercase mb-1.5 tracking-wide">X image</span>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border border-dashed border-[#8c8f94] bg-slate-50 flex items-center justify-center rounded-sm">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <button type="button" className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 px-3 py-1.5 rounded-sm font-semibold transition bg-white">
                      Select image
                    </button>
                  </div>
                </div>

                {/* X Title */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="block text-[11px] font-semibold text-[#646970] uppercase tracking-wide">X title</span>
                    <div className="flex gap-2">
                      <button type="button" className="text-[#2271b1] hover:underline font-semibold text-[10px]">Insert variable</button>
                      <button type="button" className="text-[#7200e6] hover:underline font-semibold text-[10px] flex items-center gap-0.5">✨ Generate social title</button>
                    </div>
                  </div>
                  <input type="text" className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] focus:outline-none focus:border-[#2271b1]" />
                </div>

                {/* X Description */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="block text-[11px] font-semibold text-[#646970] uppercase tracking-wide">X description</span>
                    <div className="flex gap-2">
                      <button type="button" className="text-[#2271b1] hover:underline font-semibold text-[10px]">Insert variable</button>
                      <button type="button" className="text-[#7200e6] hover:underline font-semibold text-[10px] flex items-center gap-0.5">✨ Generate social description</button>
                    </div>
                  </div>
                  <textarea rows={3} className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-[#2c3338] focus:outline-none focus:border-[#2271b1]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { tab: routeTab, subtab: routeSubtab } = useParams();
  const [token, setToken] = useState<string | null>(localStorage.getItem("travelluxx_admin_token"));
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "" });

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data
  const [bookings, setBookings] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [settingsTab, setSettingsTab] = useState<"general" | "connectors" | "writing" | "reading" | "discussion" | "media" | "permalinks" | "privacy">("general");

  // UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaViewMode, setMediaViewMode] = useState<"grid" | "list">("grid");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Quick Edit states
  const [quickEditingPostId, setQuickEditingPostId] = useState<string | null>(null);
  const [quickPostForm, setQuickPostForm] = useState({ title: "", slug: "", published: true });
  const [quickEditingPageId, setQuickEditingPageId] = useState<string | null>(null);
  const [quickPageForm, setQuickPageForm] = useState({ title: "", slug: "", published: true });

  // Yoast SEO states
  const [yoastPostTab, setYoastPostTab] = useState<"seo" | "readability" | "schema" | "social">("seo");
  const [yoastPageTab, setYoastPageTab] = useState<"seo" | "readability" | "schema" | "social">("seo");
  const [focusKeyphrasePost, setFocusKeyphrasePost] = useState("");
  const [focusKeyphrasePage, setFocusKeyphrasePage] = useState("");

  // In-Editor Media integration states
  const [editorMediaModalOpen, setEditorMediaModalOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<"post" | "page" | "post-featured" | "page-featured" | "yoast-post-social" | "yoast-page-social" | "yoast-post-x" | "yoast-page-x" | "settings-logo">("post");
  const [selectedEditorMediaUrl, setSelectedEditorMediaUrl] = useState<string | null>(null);
  const [editorMediaAltText, setEditorMediaAltText] = useState("");
  const [editorMediaTitleText, setEditorMediaTitleText] = useState("");
  const [editorMediaCaption, setEditorMediaCaption] = useState("");
  const [editorMediaDescription, setEditorMediaDescription] = useState("");

  const [mediaAltText, setMediaAltText] = useState("");
  const [mediaTitleText, setMediaTitleText] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaDescription, setMediaDescription] = useState("");

  // Editor modes (Visual vs Text html view)
  const [postEditorMode, setPostEditorMode] = useState<"visual" | "text">("visual");
  const [pageEditorMode, setPageEditorMode] = useState<"visual" | "text">("visual");

  // Post editor
  const [editingPost, setEditingPost] = useState<any>(undefined);
  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    published: true,
    metaTitle: "",
    metaDescription: "",
    date: "",
    author: "admin",
    template: "Single Posts",
    discussion: "Open",
    socialImage: "",
    xImage: ""
  });

  // Page editor
  const [editingPage, setEditingPage] = useState<any>(undefined);
  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    published: true,
    date: "",
    author: "admin",
    template: "Default Template",
    discussion: "Closed",
    image: "",
    socialImage: "",
    xImage: ""
  });

  // Media upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Menu editor
  const [newMenuItem, setNewMenuItem] = useState({ label: "", href: "", target: "_self" });

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  // Sync route params to state
  useEffect(() => {
    if (!token) return;
    if (routeTab) {
      const validTabs: Tab[] = ["dashboard", "leads", "posts", "pages", "media", "menus", "settings", "inquiries"];
      if (validTabs.includes(routeTab as Tab)) {
        setActiveTab(routeTab as Tab);
      }
      if (routeTab === "settings" && routeSubtab) {
        const validSubTabs = ["general", "connectors", "writing"];
        if (validSubTabs.includes(routeSubtab)) {
          setSettingsTab(routeSubtab as any);
        }
      }
    } else {
      setActiveTab("dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [routeTab, routeSubtab, token]);

  const handleTabClick = (tabId: Tab) => {
    if (tabId === "posts") {
      setEditingPost(undefined);
    }
    if (tabId === "pages") {
      setEditingPage(undefined);
    }
    setActiveTab(tabId);
    if (tabId === "settings") {
      navigate(`/admin/settings/${settingsTab === "general" || settingsTab === "connectors" || settingsTab === "writing" ? settingsTab : "general"}`);
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  const fetchAll = () => {
    fetchBookings(); fetchPosts(); fetchPages(); fetchSettings(); fetchMenu(); fetchInquiries(); fetchMedia();
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookings([]);
    try {
      const r = await fetch("/api/admin/bookings");
      setBookings(await r.json());
    } catch (err) {}
    setBookingsLoading(false);
  };
  const fetchPosts = async () => {
    setPostsLoading(true);
    setPosts([]);
    try {
      const r = await fetch("/api/admin/posts");
      setPosts(await r.json());
    } catch (err) {}
    setPostsLoading(false);
  };
  const fetchPages = async () => {
    setPagesLoading(true);
    setPages([]);
    try {
      const r = await fetch("/api/admin/pages");
      setPages(await r.json());
    } catch (err) {}
    setPagesLoading(false);
  };
  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    setInquiries([]);
    try {
      const r = await fetch("/api/admin/inquiries");
      setInquiries(await r.json());
    } catch (err) {}
    setInquiriesLoading(false);
  };
  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    const r = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (r.ok) window.location.reload();
  };
  const deleteSelectedInquiries = async () => {
    if (selectedInquiryIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedInquiryIds.length} selected inquiries?`)) return;
    for (const id of selectedInquiryIds) {
      await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    }
    setSelectedInquiryIds([]);
    window.location.reload();
  };
  const fetchSettings = async () => {
    const r = await fetch("/api/admin/settings"); setSettings(await r.json());
  };
  const fetchMenu = async () => {
    const r = await fetch("/api/menu"); setMenuItems(await r.json());
  };
  const fetchMedia = async () => {
    const r = await fetch("/api/admin/media"); setMedia(await r.json());
  };
  const deleteMedia = async (url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const filename = url.split("/").pop();
    const r = await fetch(`/api/admin/media/${filename}`, { method: "DELETE" });
    if (r.ok) fetchMedia();
  };

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    try {
      const url = authMode === "signin" ? "/api/admin/login" : "/api/admin/register";
      const body = authMode === "signin"
        ? { username: form.username, password: form.password }
        : { username: form.username, email: form.email, password: form.password, name: form.name };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("travelluxx_admin_token", data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || "Authentication failed");
      }
    } catch {
      setLoginError("Failed to connect to server");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => { localStorage.removeItem("travelluxx_admin_token"); setToken(null); };

  // ─── Bookings ────────────────────────────────────────────────────────────────
  const updateBookingStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) window.location.reload();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  };

  const deleteSelectedBookings = async () => {
    if (selectedBookingIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedBookingIds.length} selected bookings?`)) return;
    for (const id of selectedBookingIds) {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    }
    setSelectedBookingIds([]);
    window.location.reload();
  };

  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    const match = [b.id, b.passengerName, b.passengerEmail, b.passengerPhone, b.pickup, b.dropoff].some(v => (v || "").toLowerCase().includes(q));
    const statusMatch = statusFilter === "All" || (b.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
    return match && statusMatch;
  });

  // ─── Posts ────────────────────────────────────────────────────────────────────
  const openNewPost = () => {
    setEditingPost(null);
    setPostForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      published: true,
      metaTitle: "",
      metaDescription: "",
      date: new Date().toISOString().split("T")[0],
      author: "admin",
      template: "Single Posts",
      discussion: "Open",
      socialImage: "",
      xImage: "",
      noIndexNoFollow: false,
      faqs: []
    });
  };
  const openEditPost = (post: any) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      published: post.published !== false,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      date: post.date || new Date().toISOString().split("T")[0],
      author: post.author || "admin",
      template: post.template || "Single Posts",
      discussion: post.discussion || "Open",
      socialImage: post.socialImage || "",
      xImage: post.xImage || "",
      noIndexNoFollow: !!post.noIndexNoFollow,
      faqs: post.faqs || []
    });
  };
  const savePost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const url = editingPost ? `/api/admin/posts/${editingPost.id}` : "/api/admin/posts";
      const method = editingPost ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm)
      });
      if (res.ok) {
        setEditingPost(undefined);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  const deletePost = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  };

  // ─── Pages ───────────────────────────────────────────────────────────────────
  const openNewPage = () => {
    setEditingPage(null);
    setPageForm({
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      published: true,
      date: new Date().toISOString().split("T")[0],
      author: "admin",
      template: "Default Template",
      discussion: "Closed",
      image: "",
      socialImage: "",
      xImage: "",
      noIndexNoFollow: false
    });
  };
  const openEditPage = (page: any) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      published: page.published !== false,
      date: page.date || new Date().toISOString().split("T")[0],
      author: page.author || "admin",
      template: page.template || "Default Template",
      discussion: page.discussion || "Closed",
      image: page.image || "",
      socialImage: page.socialImage || "",
      xImage: page.xImage || "",
      noIndexNoFollow: !!page.noIndexNoFollow
    });
  };
  const savePage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const url = editingPage ? `/api/admin/pages/${editingPage.id}` : "/api/admin/pages";
      const method = editingPage ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(pageForm) });
      if (res.ok) {
        setEditingPage(undefined);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  const deletePage = async (id: string) => {
    if (!confirm("Delete page?")) return;
    const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  };

  // Quick Edit actions
  const openQuickEditPost = (post: any) => {
    setQuickEditingPostId(post.id);
    setQuickPostForm({
      title: post.title,
      slug: post.slug,
      published: post.published !== false
    });
  };
  const saveQuickPost = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    setIsSaving(true);
    try {
      const updatedPost = { ...post, ...quickPostForm };
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost)
      });
      if (res.ok) {
        setQuickEditingPostId(null);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  const openQuickEditPage = (page: any) => {
    setQuickEditingPageId(page.id);
    setQuickPageForm({
      title: page.title,
      slug: page.slug,
      published: page.published !== false
    });
  };
  const saveQuickPage = async (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    setIsSaving(true);
    try {
      const updatedPage = { ...page, ...quickPageForm };
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPage)
      });
      if (res.ok) {
        setQuickEditingPageId(null);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const insertImageIntoEditor = (imageUrl: string, altText: string) => {
    if (editorTarget === "post") {
      const imgHtml = `<img src="${imageUrl}" alt="${altText || ''}" />`;
      setPostForm(prev => ({ ...prev, content: prev.content + imgHtml }));
    } else if (editorTarget === "page") {
      const imgHtml = `<img src="${imageUrl}" alt="${altText || ''}" />`;
      setPageForm(prev => ({ ...prev, content: prev.content + imgHtml }));
    } else if (editorTarget === "post-featured") {
      setPostForm(prev => ({ ...prev, image: imageUrl }));
    } else if (editorTarget === "page-featured") {
      setPageForm(prev => ({ ...prev, image: imageUrl }));
    } else if (editorTarget === "yoast-post-social") {
      setPostForm(prev => ({ ...prev, socialImage: imageUrl }));
    } else if (editorTarget === "yoast-page-social") {
      setPageForm(prev => ({ ...prev, socialImage: imageUrl }));
    } else if (editorTarget === "yoast-post-x") {
      setPostForm(prev => ({ ...prev, xImage: imageUrl }));
    } else if (editorTarget === "yoast-page-x") {
      setPageForm(prev => ({ ...prev, xImage: imageUrl }));
    } else if (editorTarget === "settings-logo") {
      setSettings((prev: any) => ({ ...prev, logo_url: imageUrl }));
    }
    setEditorMediaModalOpen(false);
    setSelectedEditorMediaUrl(null);
    setEditorMediaAltText("");
  };

  // ─── Media Upload ─────────────────────────────────────────────────────────────
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const data = await toBase64(file);
        const res = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, data }) });
        const json = await res.json();
        if (json.url) setMedia(prev => [json.url, ...prev]);
      } catch (err) { console.error("Upload failed:", err); }
    }
    setUploading(false);
    fetchMedia();
  };

  // ─── Menu ─────────────────────────────────────────────────────────────────────
  const saveMenu = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(menuItems) });
      setSaveStatus("Menu saved!"); setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  const addMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.href) return;
    setMenuItems([...menuItems, { id: `menu-${Date.now()}`, ...newMenuItem }]);
    setNewMenuItem({ label: "", href: "", target: "_self" });
  };
  const moveMenuItem = (idx: number, dir: -1 | 1) => {
    const items = [...menuItems];
    const swap = idx + dir;
    if (swap < 0 || swap >= items.length) return;
    [items[idx], items[swap]] = [items[swap], items[idx]];
    setMenuItems(items);
  };
  const removeMenuItem = (id: string) => setMenuItems(menuItems.filter(m => m.id !== id));

  // ─── Settings ─────────────────────────────────────────────────────────────────
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSaveStatus("Saving...");
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) { setSaveStatus("Settings saved!"); setTimeout(() => setSaveStatus(""), 4000); }
      else setSaveStatus("Failed to save.");
    } catch (err) {
      console.error(err);
      setSaveStatus("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const stats = {
    leads: bookings.length,
    today: bookings.filter(b => b.createdAt?.startsWith(new Date().toISOString().slice(0, 10))).length,
    revenue: bookings.reduce((s, b) => s + Number(b.price || 0), 0),
    inquiries: inquiries.length,
    posts: posts.length,
    pages: pages.length,
  };

  // ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f1] font-sans">
        <div className="bg-white shadow-xl rounded-sm w-full max-w-sm overflow-hidden">
          <div className="bg-[#1d2327] p-6 text-center">
            <div className="w-12 h-12 bg-[#2271b1] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-black text-lg">T</span>
            </div>
            <h1 className="text-white font-bold text-xl tracking-wide">Travelluxx Admin</h1>
            <p className="text-[#a7aaad] text-xs mt-1">Management Portal</p>
          </div>

          <form onSubmit={handleAuth} className="p-6 space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1.5 uppercase tracking-wide">Username or Email</label>
              <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm text-[#1d2327] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]" placeholder="info@travelluxx.co.uk" required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-[#8c8f94] rounded px-3 py-2 pr-10 text-sm text-[#1d2327] focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#50575e] hover:text-[#1d2327]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loginLoading}
              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold py-2.5 rounded transition text-sm disabled:opacity-60">
              {loginLoading ? "Please wait..." : "Log In"}
            </button>

            <p className="text-center text-xs text-[#646970]">
              Sign in with your admin credentials.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD LAYOUT ─────────────────────────────────────────────────────────
  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
    { id: "leads", icon: <BookOpen className="w-4 h-4" />, label: "Leads & Bookings" },
    { id: "inquiries", icon: <MessageSquare className="w-4 h-4" />, label: "Contact Inquiries" },
    { id: "posts", icon: <Newspaper className="w-4 h-4" />, label: "Posts (Blog)" },
    { id: "pages", icon: <FileText className="w-4 h-4" />, label: "Pages" },
    { id: "media", icon: <Image className="w-4 h-4" />, label: "Media" },
    { id: "menus", icon: <Menu className="w-4 h-4" />, label: "Menus" },
    { id: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f1] font-sans flex flex-col text-[#1d2327] text-sm">
      {/* WP Admin Bar */}
      <div className="bg-[#1d2327] text-[#a7aaad] text-xs flex items-center justify-between px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#2271b1] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">T</span>
            </div>
            <span className="text-white font-semibold">Travelluxx</span>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-1 hover:text-white transition">
            <ExternalLink className="w-3 h-3" /> Visit Site
          </a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Administrator</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 hover:text-white transition">
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-[#1d2327] w-56 shrink-0 flex flex-col sticky top-9 h-[calc(100vh-36px)] overflow-y-auto z-40">
          <div className="py-4">
            <div className="px-4 py-2 mb-1">
              <p className="text-[#a7aaad] text-[10px] uppercase tracking-widest font-semibold">Navigation</p>
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition text-[13px] font-medium ${
                  activeTab === item.id
                    ? "bg-[#2271b1] text-white"
                    : "text-[#a7aaad] hover:bg-[#2c3338] hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
                {item.id === "leads" && bookings.length > 0 && (
                  <span className="ml-auto bg-[#2271b1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {bookings.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-0 overflow-y-auto">

          {/* ─── DASHBOARD ──────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1d2327]">Dashboard</h1>
                <p className="text-[#646970] text-xs mt-1">Welcome back! Here's an overview of your site.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Total Leads", value: stats.leads, color: "#2271b1" },
                  { label: "Today's Bookings", value: stats.today, color: "#00a32a" },
                  { label: "Total Revenue", value: `£${stats.revenue.toFixed(2)}`, color: "#d63638" },
                  { label: "Contact Inquiries", value: stats.inquiries, color: "#0284c7" },
                  { label: "Blog Posts", value: stats.posts, color: "#9c27b0" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
                    <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[#646970] text-xs mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
                  <h3 className="font-semibold text-[#1d2327] mb-3 pb-2 border-b border-[#f0f0f1]">Recent Leads</h3>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f0f0f1] last:border-0">
                        <div>
                          <span className="font-mono text-[#2271b1] font-bold">{b.id}</span>
                          <span className="text-[#646970] ml-2">{b.passengerName}</span>
                        </div>
                        <span className="font-bold text-[#1d2327]">£{Number(b.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {bookings.length === 0 && <p className="text-[#646970] text-xs">No leads yet.</p>}
                  </div>
                </div>

                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
                  <h3 className="font-semibold text-[#1d2327] mb-3 pb-2 border-b border-[#f0f0f1]">Recent Inquiries</h3>
                  <div className="space-y-2">
                    {inquiries.slice(0, 5).map(i => (
                      <div key={i.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#f0f0f1] last:border-0">
                        <div className="truncate pr-2">
                          <span className="font-semibold text-[#1d2327]">{i.name}</span>
                          <span className="text-[#646970] text-[10px] ml-2 block truncate">{i.message}</span>
                        </div>
                        <span className="text-[#646970] text-[10px] whitespace-nowrap">{i.createdAt ? new Date(i.createdAt).toLocaleDateString() : ""}</span>
                      </div>
                    ))}
                    {inquiries.length === 0 && <p className="text-[#646970] text-xs">No inquiries yet.</p>}
                  </div>
                </div>

                <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-5">
                  <h3 className="font-semibold text-[#1d2327] mb-3 pb-2 border-b border-[#f0f0f1]">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "+ New Post", tab: "posts" as Tab },
                      { label: "+ New Page", tab: "pages" as Tab },
                      { label: "Upload Media", tab: "media" as Tab },
                      { label: "Manage Menus", tab: "menus" as Tab },
                      { label: "Inquiries", tab: "inquiries" as Tab },
                      { label: "Settings", tab: "settings" as Tab },
                    ].map(l => (
                      <button key={l.label} onClick={() => handleTabClick(l.tab)}
                        className="block text-left text-xs text-[#2271b1] hover:text-[#135e96] py-1 hover:underline">
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── LEADS ──────────────────────────────────────────── */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#1d2327]">Leads & Bookings</h1>
                <span className="text-[#646970] text-xs">{filteredBookings.length} of {bookings.length}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input type="text" placeholder="Search by name, ref, location..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border border-[#8c8f94] rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#2271b1]" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="border border-[#8c8f94] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]">
                  <option value="All">All Statuses</option>
                  {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
                {selectedBookingIds.length > 0 && (
                  <button
                    type="button"
                    onClick={deleteSelectedBookings}
                    className="bg-[#d63638] hover:bg-[#b32d2e] text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                  >
                    Delete Selected ({selectedBookingIds.length})
                  </button>
                )}
              </div>

              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[#f0f0f1] text-[#646970] font-semibold uppercase text-[10px] tracking-wide border-b border-[#c3c4c7]">
                    <tr>
                      <th className="py-3 px-4 text-left w-10">
                        <input
                          type="checkbox"
                          checked={filteredBookings.length > 0 && selectedBookingIds.length === filteredBookings.length}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedBookingIds(filteredBookings.map(b => b.id));
                            } else {
                              setSelectedBookingIds([]);
                            }
                          }}
                          className="rounded-sm border-[#c3c4c7]"
                        />
                      </th>
                      <th className="py-3 px-4 text-left">Ref #</th>
                      <th className="py-3 px-4 text-left">Passenger</th>
                      <th className="py-3 px-4 text-left">Date / Time</th>
                      <th className="py-3 px-4 text-left">Route</th>
                      <th className="py-3 px-4 text-left">Vehicle</th>
                      <th className="py-3 px-4 text-left">Fare</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {bookingsLoading ? (
                      <tr><td colSpan={10} className="text-center py-10 text-[#646970] font-semibold">⚙ Loading Bookings...</td></tr>
                    ) : filteredBookings.length === 0 ? (
                      <tr><td colSpan={10} className="text-center py-10 text-[#646970]">No leads found.</td></tr>
                    ) : filteredBookings.map(b => (
                      <tr key={b.id} className={`hover:bg-[#f9f9f9] transition ${selectedBookingIds.includes(b.id) ? "bg-[#f4f8fa]" : ""}`}>
                        <td className="py-3 px-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedBookingIds.includes(b.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedBookingIds([...selectedBookingIds, b.id]);
                              } else {
                                setSelectedBookingIds(selectedBookingIds.filter(id => id !== b.id));
                              }
                            }}
                            className="rounded-sm border-[#8c8f94]"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#2271b1]">{b.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1d2327]">{b.passengerName}</div>
                          <div className="text-[#646970]">{b.passengerPhone}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#646970]">{b.date}<br />{b.time}</td>
                        <td className="py-3 px-4 max-w-[180px]">
                          <div className="truncate"><span className="text-emerald-600 font-bold">↑</span> {b.pickup}</div>
                          <div className="truncate text-[#646970]"><span className="text-red-500 font-bold">↓</span> {b.dropoff}</div>
                        </td>
                        <td className="py-3 px-4 text-[#646970]">{b.vehicle}</td>
                        <td className="py-3 px-4 font-bold text-[#1d2327]">£{Number(b.price || 0).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <select value={b.status || "Pending"} onChange={e => updateBookingStatus(b.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none ${
                              (b.status || "") === "Confirmed" ? "border-green-300 bg-green-50 text-green-700"
                              : (b.status || "") === "Completed" ? "border-blue-300 bg-blue-50 text-blue-700"
                              : (b.status || "") === "Cancelled" ? "border-red-300 bg-red-50 text-red-700"
                              : "border-yellow-300 bg-yellow-50 text-yellow-700"
                            }`}>
                            {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => <option key={s} className="bg-white text-[#1d2327]">{s}</option>)}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button onClick={() => setSelectedBooking(b)}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition">View</button>
                          <button onClick={() => deleteBooking(b.id)}
                            className="bg-[#d63638] hover:bg-[#b32d2e] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── POSTS ──────────────────────────────────────────── */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-[#23282d] font-serif">Posts</h1>
                {editingPost === undefined && (
                  <button onClick={openNewPost}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fa] hover:text-[#0a4b78] px-2.5 py-1 rounded text-xs font-semibold transition bg-white shadow-sm">
                    Add New
                  </button>
                )}
              </div>

              {editingPost !== undefined ? (
                <div className="bg-[#f0f0f1] border border-[#c3c4c7] rounded-sm overflow-hidden shadow-sm">
                  {/* WordPress Style Editor Top Bar */}
                  <div className="bg-white border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between text-xs text-[#2c3338] select-none">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800 text-[13px]">{postForm.title || "Draft"} - Post</span>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="Ctrl+K Search or jump to"
                          className="bg-[#f0f0f1] text-[#646970] rounded px-3 py-1.5 text-[11px] outline-none w-44 cursor-default text-left select-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* External preview icon */}
                      <a href={`/blog/${postForm.slug}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-slate-100 rounded text-[#2c3338]" title="View post">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button type="button" onClick={() => savePost()} className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white px-3 py-1.5 rounded-sm font-semibold transition">
                        Copy this
                      </button>

                      <button
                        type="button"
                        onClick={() => savePost()}
                        disabled={isSaving}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded-sm font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSaving && (
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-[#f0f0f1]">
                    <form onSubmit={savePost} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Left Main Content (3 cols) */}
                      <div className="lg:col-span-3 space-y-4">
                        <input
                          type="text"
                          placeholder="Add Title"
                          value={postForm.title}
                          onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                          className="w-full border border-[#c3c4c7] rounded-sm px-4 py-3 text-xl font-semibold focus:outline-none focus:border-[#2271b1] bg-white text-[#2c3338]"
                          required
                        />

                        {postForm.slug && (
                          <div className="text-xs text-[#646970] px-1">
                            <strong>Permalink:</strong> {window.location.origin}/blog/{postForm.slug}
                          </div>
                        )}

                        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-2 uppercase tracking-wider text-[#646970]">Excerpt Summary</label>
                            <textarea rows={2} value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}
                              className="w-full border border-[#8c8f94] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] text-[#2c3338]" />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wider text-[#646970]">Post Body</label>
                            <div className="border border-[#c3c4c7] rounded-sm overflow-hidden bg-white">
                              {/* Editor Top Toolbar Header */}
                              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-2 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditorTarget("post");
                                    setEditorMediaModalOpen(true);
                                  }}
                                  className="border border-[#8c8f94] bg-white text-[#2c3338] px-2.5 py-1 rounded-sm text-xs font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5"
                                >
                                  <svg className="w-3.5 h-3.5 text-[#646970]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                  Add Media
                                </button>

                                {/* Visual/Text views toggle tabs */}
                                <div className="flex border border-[#c3c4c7] rounded-sm overflow-hidden bg-white text-xs">
                                  <button
                                    type="button"
                                    onClick={() => setPostEditorMode("visual")}
                                    className={`px-2.5 py-1 font-semibold ${postEditorMode === "visual" ? "bg-white text-black font-bold" : "bg-[#f6f7f7] text-[#50575e]"}`}
                                  >
                                    Visual
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPostEditorMode("text")}
                                    className={`px-2.5 py-1 font-semibold border-l border-[#c3c4c7] ${postEditorMode === "text" ? "bg-white text-black font-bold" : "bg-[#f6f7f7] text-[#50575e]"}`}
                                  >
                                    Text
                                  </button>
                                </div>
                              </div>

                              {postEditorMode === "visual" ? (
                                <ReactQuill theme="snow" value={postForm.content} onChange={val => setPostForm({ ...postForm, content: val })} modules={quillModules} />
                              ) : (
                                <textarea
                                  value={postForm.content}
                                  onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                                  rows={15}
                                  className="w-full font-mono text-xs p-4 focus:outline-none bg-white text-[#2c3338] border-0 outline-none block"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Yoast SEO meta box below content */}
                        <YoastSeoBox
                          tab={yoastPostTab}
                          setTab={setYoastPostTab}
                          focusKeyphrase={focusKeyphrasePost}
                          setFocusKeyphrase={setFocusKeyphrasePost}
                          title={postForm.title}
                          slug={postForm.slug}
                          metaTitle={postForm.metaTitle}
                          metaDescription={postForm.metaDescription}
                          contentType="post"
                          image={postForm.image}
                          excerpt={postForm.excerpt}
                          onMetaTitleChange={v => setPostForm(prev => ({ ...prev, metaTitle: v }))}
                          onSlugChange={v => setPostForm(prev => ({ ...prev, slug: v }))}
                          onMetaDescriptionChange={v => setPostForm(prev => ({ ...prev, metaDescription: v }))}
                        />
                        {/* FAQs Editor Block */}
                        <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm mt-6">
                          <div className="border-b border-[#f0f0f1] px-4 py-2.5 bg-[#f6f7f7] flex justify-between items-center">
                            <h3 className="font-semibold text-xs text-[#2c3338]">Frequently Asked Questions (FAQ)</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedFaqs = [...(postForm.faqs || []), { question: "", answer: "" }];
                                setPostForm({ ...postForm, faqs: updatedFaqs });
                              }}
                              className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded-sm text-[10px] font-semibold transition"
                            >
                              + Add FAQ
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            {(!postForm.faqs || postForm.faqs.length === 0) ? (
                              <p className="text-xs text-slate-400">No FAQs added yet. Click "+ Add FAQ" to create one.</p>
                            ) : (
                              (postForm.faqs || []).map((faq: any, idx: number) => (
                                <div key={idx} className="border border-slate-200 p-3 rounded bg-slate-50 relative space-y-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedFaqs = (postForm.faqs || []).filter((_: any, i: number) => i !== idx);
                                      setPostForm({ ...postForm, faqs: updatedFaqs });
                                    }}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-[#646970] mb-1">QUESTION</label>
                                    <input
                                      type="text"
                                      value={faq.question}
                                      onChange={e => {
                                        const updatedFaqs = [...(postForm.faqs || [])];
                                        updatedFaqs[idx].question = e.target.value;
                                        setPostForm({ ...postForm, faqs: updatedFaqs });
                                      }}
                                      placeholder="Enter FAQ Question..."
                                      className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-black"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-[#646970] mb-1">ANSWER</label>
                                    <textarea
                                      rows={2}
                                      value={faq.answer}
                                      onChange={e => {
                                        const updatedFaqs = [...(postForm.faqs || [])];
                                        updatedFaqs[idx].answer = e.target.value;
                                        setPostForm({ ...postForm, faqs: updatedFaqs });
                                      }}
                                      placeholder="Enter FAQ Answer..."
                                      className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-black"
                                    />
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Sidebar Content (1 col) - Styled exactly like WP */}
                      <div className="lg:col-span-1 bg-white border border-[#c3c4c7] rounded-sm shadow-sm flex flex-col justify-between overflow-hidden">
                        <div>
                          {/* Sidebar Tabs */}
                          <div className="flex border-b border-[#c3c4c7] text-xs font-semibold text-[#646970] bg-[#f6f7f7]">
                            <button type="button" className="flex-1 py-2 text-center bg-white text-[#2c3338] border-b-2 border-b-[#2271b1]">Post</button>
                          </div>

                          <div className="p-4 space-y-5 text-xs text-[#2c3338]">
                            {/* Title info */}
                            <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                              <span className="font-bold text-[#1d2327] text-[13px]">{postForm.title || "Hello world!"}</span>
                              <button type="button" className="text-[#646970] hover:text-[#2c3338]">•••</button>
                            </div>

                            {/* Featured Image Selector Placeholder */}
                            <div>
                              <span className="block font-semibold text-[#2c3338] mb-2">Featured image</span>
                              {postForm.image ? (
                                <div className="relative group aspect-video rounded border border-[#c3c4c7] overflow-hidden bg-slate-50 flex items-center justify-center">
                                  <img src={postForm.image} alt="preview" className="max-w-full max-h-full object-cover" />
                                  <button type="button" onClick={() => setPostForm({ ...postForm, image: "" })}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-700">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditorTarget("post-featured");
                                    setEditorMediaModalOpen(true);
                                  }}
                                  className="w-full bg-[#f6f7f7] hover:bg-[#f0f0f1] border border-[#c3c4c7] text-[#2271b1] hover:text-[#0a4b78] py-4 rounded text-center font-semibold transition"
                                >
                                  Set featured image
                                </button>
                              )}
                            </div>

                            {/* Excerpt Link */}
                            <div>
                              <span className="text-[#2271b1] hover:underline font-semibold cursor-pointer">Add an excerpt...</span>
                            </div>

                            {/* Word count stats */}
                            <div className="text-[11px] text-[#646970] pb-2 border-b border-[#f0f0f1]">
                              {postForm.content ? postForm.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length : 0} words, 1 minute read time. Last edited 6 months ago.
                            </div>

                            {/* Info Fields */}
                            <div className="space-y-0.5">
                              {/* Status */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Status</span>
                                <select
                                  value={postForm.published ? "published" : "draft"}
                                  onChange={e => setPostForm(prev => ({ ...prev, published: e.target.value === "published" }))}
                                  className="border border-[#8c8f94] bg-white rounded-sm px-1 py-0.5 text-xs text-[#2c3338] outline-none text-right"
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                </select>
                              </div>

                              {/* Publish Date */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Publish</span>
                                <input
                                  type="date"
                                  value={postForm.date ? postForm.date.split("T")[0] : ""}
                                  onChange={e => setPostForm(prev => ({ ...prev, date: e.target.value }))}
                                  className="border border-[#8c8f94] bg-white rounded-sm px-1 py-0.5 text-xs text-[#2c3338] outline-none w-28 text-right"
                                />
                              </div>

                              {/* Slug */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Slug</span>
                                <input
                                  type="text"
                                  value={postForm.slug}
                                  onChange={e => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                                  className="w-32 text-right bg-transparent border-b border-dashed border-[#8c8f94] text-[#2c3338] outline-none font-semibold focus:border-solid focus:border-[#2271b1]"
                                />
                              </div>



                              {/* Template */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Template</span>
                                <select value={postForm.template} onChange={e => setPostForm({...postForm, template: e.target.value})} className="border border-[#c3c4c7] bg-white rounded px-1.5 py-0.5 text-xs text-[#2c3338] outline-none"><option value="Single Posts">Single Posts</option><option value="Full Width">Full Width</option><option value="Default Template">Default Template</option></select>
                              </div>

                              {/* Discussion */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Discussion</span>
                                <select value={postForm.discussion} onChange={e => setPostForm({...postForm, discussion: e.target.value})} className="border border-[#c3c4c7] bg-white rounded px-1.5 py-0.5 text-xs text-[#2c3338] outline-none"><option value="Open">Open</option><option value="Closed">Closed</option></select>
                              </div>

                              {/* Search visibility */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Search Visibility</span>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!postForm.noIndexNoFollow}
                                    onChange={e => setPostForm({ ...postForm, noIndexNoFollow: e.target.checked })}
                                    className="rounded-sm border-[#8c8f94] text-[#2271b1]"
                                  />
                                  <span className="text-[#2c3338]">Noindex</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions footer inside sidebar */}
                        <div className="p-4 border-t border-[#f0f0f1] bg-[#f6f7f7] space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Move this post to trash?")) {
                                if (editingPost) deletePost(editingPost.id);
                                setEditingPost(undefined);
                              }
                            }}
                            className="w-full text-center border border-[#d63638] text-[#d63638] hover:bg-red-50 py-2 rounded font-semibold transition"
                          >
                            Move to trash
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPost(undefined)}
                            className="w-full text-center border border-[#c3c4c7] hover:bg-white bg-transparent text-[#50575e] py-2 rounded font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-[#50575e] space-x-1.5 mb-2">
                    <span className="font-semibold text-[#000]">All ({posts.length})</span>
                    <span className="text-[#c3c4c7]">|</span>
                    <span className="text-[#2271b1] hover:underline cursor-pointer">Published ({posts.filter(p => p.published !== false).length})</span>
                    <span className="text-[#c3c4c7]">|</span>
                    <span className="text-[#2271b1] hover:underline cursor-pointer">Drafts ({posts.filter(p => p.published === false).length})</span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center justify-between bg-transparent py-1 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                        <option>Bulk Actions</option>
                        <option>Delete</option>
                      </select>
                      <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition">
                        Apply
                      </button>
                      <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none ml-2">
                        <option>All dates</option>
                      </select>
                      <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                        <option>All categories</option>
                      </select>
                      <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition">
                        Filter
                      </button>
                    </div>
                    <div>
                      <input type="text" placeholder="Search Posts" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-[13px] border-collapse">
                      <thead className="bg-white border-b border-[#c3c4c7] text-[#2c3338] font-semibold text-left">
                        <tr>
                          <th className="py-2.5 px-3 w-8 text-center"><input type="checkbox" className="rounded-sm border-[#8c8f94]" /></th>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Author</th>
                          <th className="py-2.5 px-3">Categories</th>
                          <th className="py-2.5 px-3">Tags</th>
                          <th className="py-2.5 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f1] text-[#2c3338]">
                        {posts.length === 0 ? (
                          <tr><td colSpan={6} className="text-center py-8 text-[#646970]">No posts found.</td></tr>
                        ) : posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                          quickEditingPostId === p.id ? (
                            <tr key={p.id} className="bg-[#f5f7fa] border-y-2 border-[#2271b1]">
                              <td colSpan={6} className="p-4">
                                <div className="space-y-4 text-xs text-[#2c3338]">
                                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#646970] border-b border-[#ddd] pb-1 mb-2">Quick Edit</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Title</label>
                                        <input
                                          type="text"
                                          value={quickPostForm.title}
                                          onChange={e => setQuickPostForm({ ...quickPostForm, title: e.target.value })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Slug</label>
                                        <input
                                          type="text"
                                          value={quickPostForm.slug}
                                          onChange={e => setQuickPostForm({ ...quickPostForm, slug: e.target.value })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Date</label>
                                        <div className="flex gap-1 items-center">
                                          <select className="border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-xs text-[#2c3338] outline-none">
                                            <option>08-Aug</option>
                                          </select>
                                          <input type="text" defaultValue="15" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>,</span>
                                          <input type="text" defaultValue="2026" className="w-12 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>@</span>
                                          <input type="text" defaultValue="21" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>:</span>
                                          <input type="text" defaultValue="35" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Middle Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Categories</label>
                                        <div className="border border-[#c3c4c7] bg-white p-2.5 rounded-sm max-h-[100px] overflow-y-auto space-y-1.5">
                                          <label className="flex items-center gap-1.5">
                                            <input type="checkbox" defaultChecked className="rounded-sm border-[#8c8f94]" />
                                            <span>Blog</span>
                                          </label>
                                          <label className="flex items-center gap-1.5">
                                            <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
                                            <span>News</span>
                                          </label>
                                          <label className="flex items-center gap-1.5">
                                            <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
                                            <span>Uncategorized</span>
                                          </label>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Tags (comma-separated)</label>
                                        <input
                                          type="text"
                                          placeholder="travel, luxury, chauffeur"
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        />
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Status</label>
                                        <select
                                          value={quickPostForm.published ? "published" : "draft"}
                                          onChange={e => setQuickPostForm({ ...quickPostForm, published: e.target.value === "published" })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        >
                                          <option value="published">Published</option>
                                          <option value="draft">Draft</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2 pt-2">
                                        <label className="flex items-center gap-1.5 font-medium text-[#2c3338]">
                                          <input type="checkbox" defaultChecked className="rounded-sm border-[#8c8f94]" />
                                          <span>Allow Comments</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 font-medium text-[#2c3338]">
                                          <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
                                          <span>Make this post sticky</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2 text-xs border-t border-[#ddd] pt-3">
                                    <button
                                      type="button"
                                      onClick={() => setQuickEditingPostId(null)}
                                      className="border border-[#c3c4c7] hover:bg-slate-100 text-[#50575e] px-3 py-1.5 rounded-sm font-semibold transition bg-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => saveQuickPost(p.id)}
                                      disabled={isSaving}
                                      className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded-sm font-semibold transition shadow-sm flex items-center gap-1 disabled:opacity-50"
                                    >
                                      {isSaving && (
                                        <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                      )}
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={p.id} className="hover:bg-[#f6f7f7] transition group">
                              <td className="py-3 px-3 text-center"><input type="checkbox" className="rounded-sm border-[#8c8f94]" /></td>
                              <td className="py-3 px-3 font-semibold text-[#2271b1] max-w-xs">
                                <span onClick={() => openEditPost(p)} className="hover:text-[#00a0d2] cursor-pointer text-sm block mb-1">{p.title}</span>
                                <div className="hidden group-hover:flex items-center gap-1.5 text-xs font-normal text-[#555] select-none">
                                  <button onClick={() => openEditPost(p)} className="text-[#2271b1] hover:text-[#00a0d2]">Edit</button>
                                  <span className="text-[#ddd]">|</span>
                                  <button onClick={() => openQuickEditPost(p)} className="text-[#2271b1] hover:text-[#00a0d2]">Quick Edit</button>
                                  <span className="text-[#ddd]">|</span>
                                  <button onClick={() => deletePost(p.id)} className="text-[#b32d2e] hover:text-[#d63638]">Trash</button>
                                  <span className="text-[#ddd]">|</span>
                                  <a href={`/blog/${p.slug}`} target="_blank" className="text-[#2271b1] hover:text-[#00a0d2]">View</a>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-[#50575e]">Travelluxx Admin</td>
                              <td className="py-3 px-3 text-[#2271b1] hover:underline cursor-pointer">Blog</td>
                              <td className="py-3 px-3 text-[#50575e]">—</td>
                              <td className="py-3 px-3 text-[#50575e]">
                                <span className="font-semibold text-xs text-[#2c3338]">{p.published !== false ? "Published" : "Draft"}</span><br />
                                {p.date || "N/A"}
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── PAGES ──────────────────────────────────────────── */}
          {activeTab === "pages" && (
            <div className="space-y-4">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-[#23282d] font-serif">Pages</h1>
                {editingPage === undefined && (
                  <button onClick={openNewPage}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fa] hover:text-[#0a4b78] px-2.5 py-1 rounded text-xs font-semibold transition bg-white shadow-sm">
                    Add New
                  </button>
                )}
              </div>

              {editingPage !== undefined ? (
                <div className="bg-[#f0f0f1] border border-[#c3c4c7] rounded-sm overflow-hidden shadow-sm">
                  {/* WordPress Style Editor Top Bar */}
                  <div className="bg-white border-b border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between text-xs text-[#2c3338] select-none">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800 text-[13px]">{pageForm.title || "Draft"} - Page</span>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value="Ctrl+K Search or jump to"
                          className="bg-[#f0f0f1] text-[#646970] rounded px-3 py-1.5 text-[11px] outline-none w-44 cursor-default text-left select-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* External preview icon */}
                      <a href={`/page/${pageForm.slug}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-slate-100 rounded text-[#2c3338]" title="View page">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      
                      {/* Device preview */}
                      <button type="button" className="p-1.5 hover:bg-slate-100 rounded text-[#2c3338]" title="Desktop view">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>
                      </button>

                      <a href={`/page/${pageForm.slug}`} target="_blank" rel="noreferrer" className="text-[#2271b1] hover:underline font-semibold mr-1">Preview</a>

                      <button type="button" onClick={() => savePage()} className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white px-3 py-1.5 rounded-sm font-semibold transition">
                        Copy this
                      </button>

                      <button type="button" className="p-1.5 hover:bg-slate-100 rounded text-[#2c3338]" title="Settings sidebar toggle">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </button>

                      <button type="button" className="text-[#f0b01c] font-black text-sm px-1.5" title="Yoast Settings">
                        Y
                      </button>

                      <button
                        type="button"
                        onClick={() => savePage()}
                        disabled={isSaving}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded-sm font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSaving && (
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-[#f0f0f1]">
                    <form onSubmit={savePage} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Left Main Content (3 cols) */}
                      <div className="lg:col-span-3 space-y-4">
                        <input
                          type="text"
                          placeholder="Add Title"
                          value={pageForm.title}
                          onChange={e => setPageForm({ ...pageForm, title: e.target.value })}
                          className="w-full border border-[#c3c4c7] rounded-sm px-4 py-3 text-xl font-semibold focus:outline-none focus:border-[#2271b1] bg-white text-[#2c3338]"
                          required
                        />

                        {pageForm.slug && (
                          <div className="text-xs text-[#646970] px-1">
                            <strong>Permalink:</strong> {window.location.origin}/page/{pageForm.slug}
                          </div>
                        )}

                        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 space-y-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wider text-[#646970]">Page Content</label>
                            <div className="border border-[#c3c4c7] rounded-sm overflow-hidden bg-white">
                              {/* Editor Top Toolbar Header */}
                              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-2 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditorTarget("page");
                                    setEditorMediaModalOpen(true);
                                  }}
                                  className="border border-[#8c8f94] bg-white text-[#2c3338] px-2.5 py-1 rounded-sm text-xs font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-1.5"
                                >
                                  <svg className="w-3.5 h-3.5 text-[#646970]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                  Add Media
                                </button>

                                {/* Visual/Text views toggle tabs */}
                                <div className="flex border border-[#c3c4c7] rounded-sm overflow-hidden bg-white text-xs">
                                  <button
                                    type="button"
                                    onClick={() => setPageEditorMode("visual")}
                                    className={`px-2.5 py-1 font-semibold ${pageEditorMode === "visual" ? "bg-white text-black font-bold" : "bg-[#f6f7f7] text-[#50575e]"}`}
                                  >
                                    Visual
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPageEditorMode("text")}
                                    className={`px-2.5 py-1 font-semibold border-l border-[#c3c4c7] ${pageEditorMode === "text" ? "bg-white text-black font-bold" : "bg-[#f6f7f7] text-[#50575e]"}`}
                                  >
                                    Text
                                  </button>
                                </div>
                              </div>

                              {pageEditorMode === "visual" ? (
                                <ReactQuill theme="snow" value={pageForm.content} onChange={val => setPageForm({ ...pageForm, content: val })} modules={quillModules} />
                              ) : (
                                <textarea
                                  value={pageForm.content}
                                  onChange={e => setPageForm({ ...pageForm, content: e.target.value })}
                                  rows={15}
                                  className="w-full font-mono text-xs p-4 focus:outline-none bg-white text-[#2c3338] border-0 outline-none block"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Yoast SEO box for Pages */}
                        <YoastSeoBox
                          tab={yoastPageTab}
                          setTab={setYoastPageTab}
                          focusKeyphrase={focusKeyphrasePage}
                          setFocusKeyphrase={setFocusKeyphrasePage}
                          title={pageForm.title}
                          slug={pageForm.slug}
                          metaTitle={pageForm.metaTitle}
                          metaDescription={pageForm.metaDescription}
                          contentType="page"
                          image={pageForm.image}
                          excerpt=""
                          onMetaTitleChange={v => setPageForm(prev => ({ ...prev, metaTitle: v }))}
                          onSlugChange={v => setPageForm(prev => ({ ...prev, slug: v }))}
                          onMetaDescriptionChange={v => setPageForm(prev => ({ ...prev, metaDescription: v }))}
                        />
                      </div>

                      {/* Right Sidebar Content (1 col) - Styled exactly like WP */}
                      <div className="lg:col-span-1 bg-white border border-[#c3c4c7] rounded-sm shadow-sm flex flex-col justify-between overflow-hidden">
                        <div>
                          {/* Sidebar Tabs */}
                          <div className="flex border-b border-[#c3c4c7] text-xs font-semibold text-[#646970] bg-[#f6f7f7]">
                            <button type="button" className="flex-1 py-2 text-center bg-white text-[#2c3338] border-b-2 border-b-[#2271b1]">Page</button>
                          </div>

                          <div className="p-4 space-y-5 text-xs text-[#2c3338]">
                            {/* Title info */}
                            <div className="flex justify-between items-center pb-2 border-b border-[#f0f0f1]">
                              <span className="font-bold text-[#1d2327] text-[13px]">{pageForm.title || "Untitled"}</span>
                              <button type="button" className="text-[#646970] hover:text-[#2c3338]">•••</button>
                            </div>

                            {/* Featured Image Selector Placeholder */}
                            <div>
                              <span className="block font-semibold text-[#2c3338] mb-2">Featured image</span>
                              {pageForm.image ? (
                                <div className="relative group aspect-video rounded border border-[#c3c4c7] overflow-hidden bg-slate-50 flex items-center justify-center">
                                  <img src={pageForm.image} alt="preview" className="max-w-full max-h-full object-cover" />
                                  <button type="button" onClick={() => setPageForm({ ...pageForm, image: "" })}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-700">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditorTarget("page-featured");
                                    setEditorMediaModalOpen(true);
                                  }}
                                  className="w-full bg-[#f6f7f7] hover:bg-[#f0f0f1] border border-[#c3c4c7] text-[#2271b1] hover:text-[#0a4b78] py-4 rounded text-center font-semibold transition"
                                >
                                  Set featured image
                                </button>
                              )}
                            </div>

                            {/* Word count stats */}
                            <div className="text-[11px] text-[#646970] pb-2 border-b border-[#f0f0f1]">
                              {pageForm.content ? pageForm.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length : 0} words, 1 minute read time. Last edited 6 months ago.
                            </div>

                            {/* Info Fields */}
                            <div className="space-y-0.5">
                              {/* Status */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Status</span>
                                <select
                                  value={pageForm.published ? "published" : "draft"}
                                  onChange={e => setPageForm(prev => ({ ...prev, published: e.target.value === "published" }))}
                                  className="border border-[#8c8f94] bg-white rounded-sm px-1 py-0.5 text-xs text-[#2c3338] outline-none text-right"
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                </select>
                              </div>

                              {/* Publish Date */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Publish</span>
                                <input
                                  type="date"
                                  value={pageForm.date ? pageForm.date.split("T")[0] : ""}
                                  onChange={e => setPageForm(prev => ({ ...prev, date: e.target.value }))}
                                  className="border border-[#8c8f94] bg-white rounded-sm px-1 py-0.5 text-xs text-[#2c3338] outline-none w-28 text-right"
                                />
                              </div>

                              {/* Slug */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Slug</span>
                                <input
                                  type="text"
                                  value={pageForm.slug}
                                  onChange={e => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                                  className="w-32 text-right bg-transparent border-b border-dashed border-[#8c8f94] text-[#2c3338] outline-none font-semibold focus:border-solid focus:border-[#2271b1]"
                                />
                              </div>



                              {/* Template */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Template</span>
                                <select value={pageForm.template} onChange={e => setPageForm({...pageForm, template: e.target.value})} className="border border-[#c3c4c7] bg-white rounded px-1.5 py-0.5 text-xs text-[#2c3338] outline-none"><option value="Default Template">Default Template</option><option value="Full Width">Full Width</option><option value="Landing Page">Landing Page</option></select>
                              </div>

                              {/* Discussion */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Discussion</span>
                                <select value={pageForm.discussion} onChange={e => setPageForm({...pageForm, discussion: e.target.value})} className="border border-[#c3c4c7] bg-white rounded px-1.5 py-0.5 text-xs text-[#2c3338] outline-none"><option value="Open">Open</option><option value="Closed">Closed</option></select>
                              </div>

                              {/* Search visibility */}
                              <div className="flex justify-between items-center py-2 border-b border-[#f0f0f1] text-[13px]">
                                <span className="text-[#646970]">Search Visibility</span>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!pageForm.noIndexNoFollow}
                                    onChange={e => setPageForm({ ...pageForm, noIndexNoFollow: e.target.checked })}
                                    className="rounded-sm border-[#8c8f94] text-[#2271b1]"
                                  />
                                  <span className="text-[#2c3338]">Noindex</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions footer inside sidebar */}
                        <div className="p-4 border-t border-[#f0f0f1] bg-[#f6f7f7] space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Move this page to trash?")) {
                                if (editingPage) deletePage(editingPage.id);
                                setEditingPage(undefined);
                              }
                            }}
                            className="w-full text-center border border-[#d63638] text-[#d63638] hover:bg-red-50 py-2 rounded font-semibold transition"
                          >
                            Move to trash
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPage(undefined)}
                            className="w-full text-center border border-[#c3c4c7] hover:bg-white bg-transparent text-[#50575e] py-2 rounded font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-[#50575e] space-x-1.5 mb-2">
                    <span className="font-semibold text-[#000]">All ({pages.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center justify-between bg-transparent py-1 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                        <option>Bulk Actions</option>
                        <option>Delete</option>
                      </select>
                      <button className="border border-[#8c8f94] bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2c3338] px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition">
                        Apply
                      </button>
                    </div>
                    <div>
                      <input type="text" placeholder="Search Pages" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]" />
                    </div>
                  </div>

                  <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-[13px] border-collapse">
                      <thead className="bg-white border-b border-[#c3c4c7] text-[#2c3338] font-semibold text-left">
                        <tr>
                          <th className="py-2.5 px-3 w-8 text-center"><input type="checkbox" className="rounded-sm border-[#8c8f94]" /></th>
                          <th className="py-2.5 px-3">Title</th>
                          <th className="py-2.5 px-3">Slug / URL</th>
                          <th className="py-2.5 px-3">Author</th>
                          <th className="py-2.5 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f1] text-[#2c3338]">
                        {pages.length === 0 ? (
                          <tr><td colSpan={5} className="text-center py-8 text-[#646970]">No pages found.</td></tr>
                        ) : pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                          quickEditingPageId === p.id ? (
                            <tr key={p.id} className="bg-[#f5f7fa] border-y-2 border-[#2271b1]">
                              <td colSpan={5} className="p-4">
                                <div className="space-y-4 text-xs text-[#2c3338]">
                                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#646970] border-b border-[#ddd] pb-1 mb-2">Quick Edit</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Title</label>
                                        <input
                                          type="text"
                                          value={quickPageForm.title}
                                          onChange={e => setQuickPageForm({ ...quickPageForm, title: e.target.value })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Slug</label>
                                        <input
                                          type="text"
                                          value={quickPageForm.slug}
                                          onChange={e => setQuickPageForm({ ...quickPageForm, slug: e.target.value })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Date</label>
                                        <div className="flex gap-1 items-center">
                                          <select className="border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-xs text-[#2c3338] outline-none">
                                            <option>08-Aug</option>
                                          </select>
                                          <input type="text" defaultValue="15" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>,</span>
                                          <input type="text" defaultValue="2026" className="w-12 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>@</span>
                                          <input type="text" defaultValue="21" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                          <span>:</span>
                                          <input type="text" defaultValue="35" className="w-8 border border-[#8c8f94] bg-white rounded-sm px-1 py-1 text-center text-xs" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Middle Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Parent Page</label>
                                        <select className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                                          <option>(no parent)</option>
                                          {pages.filter(item => item.id !== p.id).map(item => (
                                            <option key={item.id} value={item.id}>{item.title}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Order</label>
                                        <input
                                          type="number"
                                          defaultValue={0}
                                          className="w-20 border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs text-[#2c3338]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Template</label>
                                        <select className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                                          <option>Default Template</option>
                                          <option>Full Width Page</option>
                                          <option>Landing Page</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#2c3338] mb-1">Status</label>
                                        <select
                                          value={quickPageForm.published ? "published" : "draft"}
                                          onChange={e => setQuickPageForm({ ...quickPageForm, published: e.target.value === "published" })}
                                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                                        >
                                          <option value="published">Published</option>
                                          <option value="draft">Draft</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2 pt-2">
                                        <label className="flex items-center gap-1.5 font-medium text-[#2c3338]">
                                          <input type="checkbox" defaultChecked className="rounded-sm border-[#8c8f94]" />
                                          <span>Allow Comments</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 font-medium text-[#2c3338]">
                                          <input type="checkbox" className="rounded-sm border-[#8c8f94]" />
                                          <span>Make this page private</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2 text-xs border-t border-[#ddd] pt-3">
                                    <button
                                      type="button"
                                      onClick={() => setQuickEditingPageId(null)}
                                      className="border border-[#c3c4c7] hover:bg-slate-100 text-[#50575e] px-3 py-1.5 rounded-sm font-semibold transition bg-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => saveQuickPage(p.id)} disabled={isSaving}
                                      className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded-sm font-semibold transition shadow-sm"
                                    >
                                      {isSaving && <svg className="animate-spin h-3 w-3 mr-1 text-white inline-block" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}Update
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={p.id} className="hover:bg-[#f6f7f7] transition group">
                              <td className="py-3 px-3 text-center"><input type="checkbox" className="rounded-sm border-[#8c8f94]" /></td>
                              <td className="py-3 px-3 font-semibold text-[#2271b1] max-w-xs">
                                <span onClick={() => openEditPage(p)} className="hover:text-[#00a0d2] cursor-pointer text-sm block mb-1">{p.title}</span>
                                <div className="hidden group-hover:flex items-center gap-1.5 text-xs font-normal text-[#555] select-none">
                                  <button onClick={() => openEditPage(p)} className="text-[#2271b1] hover:text-[#00a0d2]">Edit</button>
                                  <span className="text-[#ddd]">|</span>
                                  <button onClick={() => openQuickEditPage(p)} className="text-[#2271b1] hover:text-[#00a0d2]">Quick Edit</button>
                                  <span className="text-[#ddd]">|</span>
                                  <button onClick={() => deletePage(p.id)} className="text-[#b32d2e] hover:text-[#d63638]">Trash</button>
                                  <span className="text-[#ddd]">|</span>
                                  <a href={`/page/${p.slug}`} target="_blank" className="text-[#2271b1] hover:text-[#00a0d2]">View</a>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[#2271b1]">/page/{p.slug}</td>
                              <td className="py-3 px-3 text-[#50575e]">Travelluxx Admin</td>
                              <td className="py-3 px-3 text-[#50575e]">{p.published !== false ? "Published" : "Draft"}</td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── INQUIRIES ───────────────────────────────────────── */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-[#1d2327]">Contact Inquiries</h1>
                  {selectedInquiryIds.length > 0 && (
                    <button
                      type="button"
                      onClick={deleteSelectedInquiries}
                      className="bg-[#d63638] hover:bg-[#b32d2e] text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                    >
                      Delete Selected ({selectedInquiryIds.length})
                    </button>
                  )}
                </div>
                <span className="text-[#646970] text-xs">{inquiries.length} total inquiries</span>
              </div>
              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[#f0f0f1] text-[#646970] font-semibold uppercase text-[10px] tracking-wide border-b border-[#c3c4c7]">
                    <tr>
                      <th className="py-3 px-4 text-left w-10">
                        <input
                          type="checkbox"
                          checked={inquiries.length > 0 && selectedInquiryIds.length === inquiries.length}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedInquiryIds(inquiries.map(i => i.id));
                            } else {
                              setSelectedInquiryIds([]);
                            }
                          }}
                          className="rounded-sm border-[#c3c4c7]"
                        />
                      </th>
                      <th className="py-3 px-4 text-left">Sender Details</th>
                      <th className="py-3 px-4 text-left">Message</th>
                      <th className="py-3 px-4 text-left">Type / Subject</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {inquiriesLoading ? (
                      <tr><td colSpan={7} className="text-center py-10 text-[#646970] font-semibold">⚙ Loading Inquiries...</td></tr>
                    ) : inquiries.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-10 text-[#646970]">No contact inquiries found.</td></tr>
                    ) : inquiries.map(i => (
                      <tr key={i.id} className={`hover:bg-[#f9f9f9] transition ${selectedInquiryIds.includes(i.id) ? "bg-[#f4f8fa]" : ""}`}>
                        <td className="py-3 px-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedInquiryIds.includes(i.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedInquiryIds([...selectedInquiryIds, i.id]);
                              } else {
                                setSelectedInquiryIds(selectedInquiryIds.filter(id => id !== i.id));
                              }
                            }}
                            className="rounded-sm border-[#8c8f94]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1d2327]">{i.name}</div>
                          <div className="text-[#646970] font-mono">{i.email}</div>
                          {i.phone && <div className="text-[#646970]">{i.phone}</div>}
                        </td>
                        <td className="py-3 px-4 max-w-[280px]">
                          <p className="whitespace-pre-line text-[#1d2327]">{i.message}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#2271b1] font-semibold">{i.type || "General Inquiry"}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#646970]">
                          {i.createdAt ? new Date(i.createdAt).toLocaleDateString() : "N/A"}<br />
                          {i.createdAt ? new Date(i.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button onClick={() => setSelectedInquiry(i)}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition">
                            View
                          </button>
                          <button onClick={() => deleteInquiry(i.id)}
                            className="bg-[#d63638] hover:bg-[#b32d2e] text-white px-2.5 py-1 rounded text-[10px] font-semibold transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── MEDIA ──────────────────────────────────────────── */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-2xl font-semibold text-[#23282d] font-serif">Media Library</h1>
                <button onClick={() => fileInputRef.current?.click()}
                  className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fa] hover:text-[#0a4b78] px-2.5 py-1 rounded text-xs font-semibold transition bg-white shadow-sm">
                  Add New
                </button>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
                  onChange={e => handleFileUpload(e.target.files)} />
              </div>

              {/* WordPress style filters and View Switcher */}
              <div className="flex flex-wrap gap-2 items-center justify-between bg-transparent py-1 text-xs">
                <div className="flex gap-2 items-center">
                  {/* Grid view icon */}
                  <button onClick={() => setMediaViewMode("grid")} className={`p-1.5 border rounded-sm ${mediaViewMode === "grid" ? "bg-[#e0e0e0] border-[#8c8f94]" : "bg-white border-[#c3c4c7]"} hover:bg-slate-50 transition`}>
                    <svg className="w-3.5 h-3.5 text-[#2c3338]" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
                  </button>
                  {/* List view icon */}
                  <button onClick={() => setMediaViewMode("list")} className={`p-1.5 border rounded-sm ${mediaViewMode === "list" ? "bg-[#e0e0e0] border-[#8c8f94]" : "bg-white border-[#c3c4c7]"} hover:bg-slate-50 transition`}>
                    <svg className="w-3.5 h-3.5 text-[#2c3338]" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"/></svg>
                  </button>

                  <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none ml-2">
                    <option>All media items</option>
                  </select>
                  <select className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs text-[#2c3338] outline-none">
                    <option>All dates</option>
                  </select>
                </div>
                <div>
                  <input type="text" placeholder="Search media items" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="border border-[#8c8f94] bg-white rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]" />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition ${uploading ? "border-[#2271b1] bg-blue-50" : "border-[#c3c4c7] hover:border-[#2271b1] bg-white"}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                onDragOver={e => e.preventDefault()}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-[#8c8f94]" />
                <p className="text-[#646970] font-medium text-xs">{uploading ? "Uploading files..." : "Drag & drop images here to upload, or click to browse"}</p>
              </div>

              {media.length > 0 ? (
                mediaViewMode === "grid" ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 bg-white border border-[#c3c4c7] p-4 rounded-sm shadow-sm">
                    {media.filter(url => url.toLowerCase().includes(searchQuery.toLowerCase())).map((url, i) => (
                      <div key={i} onClick={() => {
                        setSelectedMedia(url);
                        const fname = url.split("/").pop() || "";
                        setMediaTitleText(fname.split(".")[0] || fname);
                        setMediaAltText("");
                        setMediaCaption("");
                        setMediaDescription("");
                      }} className="aspect-square bg-slate-50 border border-[#c3c4c7] hover:border-[#2271b1] cursor-pointer relative overflow-hidden group shadow-sm">
                        <img src={url} alt={`media-${i}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#2c3338] font-semibold">
                        <tr>
                          <th className="py-2 px-3 w-16">File</th>
                          <th className="py-2 px-3">Name / URL</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f1] text-[#50575e]">
                        {media.filter(url => url.toLowerCase().includes(searchQuery.toLowerCase())).map((url, i) => {
                          const filename = url.split("/").pop() || "";
                          return (
                            <tr key={i} className="hover:bg-[#f6f7f7] transition group">
                              <td className="py-2 px-3">
                                <img src={url} alt="" className="w-10 h-10 object-cover border border-[#c3c4c7] rounded-sm" />
                              </td>
                              <td className="py-2 px-3">
                                <div className="font-semibold text-[#2c3338]">{filename}</div>
                                <div className="font-mono text-[#2271b1] text-[10px] select-all">{window.location.origin + url}</div>
                              </td>
                              <td className="py-2 px-3 text-[#646970]">Uploaded</td>
                              <td className="py-2 px-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(window.location.origin + url);
                                    alert("Image URL copied!");
                                  }}
                                  className="text-[#2271b1] hover:underline"
                                >
                                  Copy Link
                                </button>
                                <span className="text-[#ddd]">|</span>
                                <button
                                  onClick={() => deleteMedia(url)}
                                  className="text-[#b32d2e] hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="text-center py-10 bg-white border border-[#c3c4c7] rounded-sm text-slate-400 text-xs shadow-sm">
                  No uploaded files found. Upload some images to display them here!
                </div>
              )}
            </div>
          )}

          {/* ─── MENUS ──────────────────────────────────────────── */}
          {activeTab === "menus" && (
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-2xl font-bold text-[#1d2327]">Menu Manager</h1>
              <p className="text-[#646970] text-xs">Manage the navigation links shown in the website header. Reorder by using the arrows. Changes saved to database.</p>

              {saveStatus && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-xs font-medium">{saveStatus}</div>
              )}

              <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
                <div className="px-5 py-3 border-b border-[#f0f0f1]">
                  <h3 className="font-semibold text-[#1d2327] text-sm">Header Navigation Items</h3>
                </div>
                <div className="divide-y divide-[#f0f0f1]">
                  {menuItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveMenuItem(idx, -1)} disabled={idx === 0}
                          className="p-0.5 hover:bg-[#f0f0f1] rounded disabled:opacity-30 disabled:cursor-not-allowed">
                          <ChevronUp className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                        <button onClick={() => moveMenuItem(idx, 1)} disabled={idx === menuItems.length - 1}
                          className="p-0.5 hover:bg-[#f0f0f1] rounded disabled:opacity-30 disabled:cursor-not-allowed">
                          <ChevronDown className="w-3.5 h-3.5 text-[#646970]" />
                        </button>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input type="text" value={item.label} onChange={e => {
                          const updated = [...menuItems]; updated[idx] = { ...updated[idx], label: e.target.value }; setMenuItems(updated);
                        }} placeholder="Label" className="border border-[#8c8f94] rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
                        <input type="text" value={item.href} onChange={e => {
                          const updated = [...menuItems]; updated[idx] = { ...updated[idx], href: e.target.value }; setMenuItems(updated);
                        }} placeholder="Link e.g. /blog or /#calculator" className="border border-[#8c8f94] rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
                      </div>
                      <select value={item.target} onChange={e => {
                        const updated = [...menuItems]; updated[idx] = { ...updated[idx], target: e.target.value }; setMenuItems(updated);
                      }} className="border border-[#8c8f94] rounded px-2 py-1.5 text-xs focus:outline-none">
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                      </select>
                      <button onClick={() => removeMenuItem(item.id)}
                        className="text-[#d63638] hover:text-[#b32d2e] p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new item */}
                <div className="px-5 py-3 border-t border-[#f0f0f1] bg-[#f9f9f9]">
                  <div className="flex items-center gap-3">
                    <input type="text" value={newMenuItem.label} onChange={e => setNewMenuItem({ ...newMenuItem, label: e.target.value })}
                      placeholder="Label" className="border border-[#8c8f94] rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2271b1] flex-1" />
                    <input type="text" value={newMenuItem.href} onChange={e => setNewMenuItem({ ...newMenuItem, href: e.target.value })}
                      placeholder="/blog or /#section" className="border border-[#8c8f94] rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2271b1] flex-1" />
                    <button onClick={addMenuItem}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={saveMenu} disabled={isSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 transition disabled:opacity-50">
                {isSaving ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Menu Changes
              </button>
            </div>
          )}

          {/* ─── SETTINGS ─────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-[#1d2327]">Settings</h1>

              {saveStatus && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm font-medium">{saveStatus}</div>
              )}

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Left Sidebar of Settings Tab */}
                <div className="w-full md:w-48 bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden shrink-0">
                  {[
                    { key: "general", label: "General" },
                    { key: "connectors", label: "Connectors" },
                    { key: "writing", label: "Writing" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSettingsTab(tab.key as any)}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold border-b border-[#f0f0f1] last:border-0 transition ${
                        settingsTab === tab.key
                          ? "bg-[#2271b1] text-white"
                          : "text-[#50575e] hover:bg-[#f6f7f7] hover:text-[#2c3338]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Right content of Settings Tab */}
                <div className="flex-1 bg-white border border-[#c3c4c7] rounded shadow-sm p-6 w-full">
                  <form onSubmit={saveSettings} className="space-y-6">
                    {settingsTab === "general" && (
                      <div className="space-y-4">
                        <h2 className="font-bold text-[#1d2327] text-sm mb-4 pb-2 border-b border-[#f0f0f1]">
                          🏢 Business Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Business Name</label>
                            <input type="text" value={settings.business_name || ""}
                              onChange={e => setSettings({ ...settings, business_name: e.target.value })}
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Business Email</label>
                            <input type="email" value={settings.business_email || ""}
                              onChange={e => setSettings({ ...settings, business_email: e.target.value })}
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">WhatsApp Number</label>
                            <input type="text" value={settings.whatsapp_number || ""}
                              onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Office Address</label>
                            <input type="text" value={settings.office_address || ""}
                              onChange={e => setSettings({ ...settings, office_address: e.target.value })}
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Footer Copyright Line</label>
                            <input type="text" value={settings.footer_info || ""}
                              onChange={e => setSettings({ ...settings, footer_info: e.target.value })}
                              placeholder="© 2026 Travelluxx. All rights reserved."
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                            <p className="text-[#646970] text-[10px] mt-1">This text displays in the website footer.</p>
                          </div>

                          {/* Logo Management */}
                          <div className="md:col-span-2 border-t border-[#f0f0f1] pt-4">
                            <h2 className="font-bold text-[#1d2327] text-sm mb-4">
                              🎨 Logo Management
                            </h2>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-2">Site Logo</label>
                            
                            <div className="flex items-start gap-4">
                              <div className="w-40 h-24 bg-[#f0f0f1] border border-[#c3c4c7] rounded-sm flex items-center justify-center overflow-hidden">
                                {settings.logo_url ? (
                                  <img src={settings.logo_url} alt="Site Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                  <span className="text-[#646970] text-xs">No Logo</span>
                                )}
                              </div>
                              <div className="space-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditorTarget("settings-logo");
                                    setEditorMediaModalOpen(true);
                                  }}
                                  className="bg-white border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7] px-3 py-1.5 rounded-sm text-xs font-semibold transition"
                                >
                                  {settings.logo_url ? "Replace Image" : "Select Image"}
                                </button>
                                {settings.logo_url && (
                                  <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, logo_url: "" })}
                                    className="block text-[#d63638] hover:text-[#b32d2e] text-xs underline"
                                  >
                                    Remove Logo
                                  </button>
                                )}
                                <p className="text-[#646970] text-[10px] max-w-xs">
                                  Upload a high-resolution logo. Transparent PNG or SVG is recommended.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Search engine visibility */}
                          <div className="md:col-span-2 border-t border-[#f0f0f1] pt-4">
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Search Engine Visibility</label>
                            <label className="flex items-start gap-2 cursor-pointer font-medium text-xs mt-2 text-black">
                              <input
                                type="checkbox"
                                checked={!!settings.search_engine_visibility}
                                onChange={e => setSettings({ ...settings, search_engine_visibility: e.target.checked })}
                                className="rounded-sm border-[#8c8f94] text-[#2271b1] mt-0.5"
                              />
                              <span>Discourage search engines from indexing this site</span>
                            </label>
                            <p className="text-[11px] text-[#646970] pl-6 mt-1">
                              This will add noindex and nofollow tags to all your public pages.
                            </p>
                          </div>

                          {/* Homepage Displays */}
                          <div className="md:col-span-2 border-t border-[#f0f0f1] pt-4">
                            <label className="block text-xs font-semibold text-[#1d2327] mb-2">Your homepage displays</label>
                            <div className="space-y-3">
                              <label className="flex items-center gap-2 cursor-pointer text-xs text-black">
                                <input
                                  type="radio"
                                  name="homepage_displays"
                                  checked={settings.homepage_displays !== "page"}
                                  onChange={() => setSettings({ ...settings, homepage_displays: "latest" })}
                                  className="text-[#2271b1] focus:ring-[#2271b1]"
                                />
                                <span>Your latest posts (Landing page calculator layout)</span>
                              </label>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-black">
                                  <input
                                    type="radio"
                                    name="homepage_displays"
                                    checked={settings.homepage_displays === "page"}
                                    onChange={() => setSettings({ ...settings, homepage_displays: "page" })}
                                    className="text-[#2271b1]"
                                  />
                                  <span>A static page (select below)</span>
                                </label>
                                {settings.homepage_displays === "page" && (
                                  <div className="pl-6 space-y-2 text-[11px] text-black">
                                    <div className="flex items-center gap-3">
                                      <span className="w-24">Homepage:</span>
                                      <select
                                        value={settings.homepage_page_id || ""}
                                        onChange={e => setSettings({ ...settings, homepage_page_id: e.target.value })}
                                        className="border border-[#8c8f94] bg-white rounded px-2 py-1 text-xs w-48 text-black"
                                      >
                                        <option value="">— Select —</option>
                                        {pages.map(p => (
                                          <option key={p.id} value={p.slug}>{p.title}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="w-24">Posts page:</span>
                                      <select
                                        value={settings.posts_page_id || ""}
                                        onChange={e => setSettings({ ...settings, posts_page_id: e.target.value })}
                                        className="border border-[#8c8f94] bg-white rounded px-2 py-1 text-xs w-48 text-black"
                                      >
                                        <option value="">— Select —</option>
                                        <option value="blog">Blog (Default)</option>
                                        {pages.map(p => (
                                          <option key={p.id} value={p.slug}>{p.title}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Homepage SEO Settings */}
                          <div className="md:col-span-2 border-t border-[#f0f0f1] pt-4">
                            <h2 className="font-bold text-[#1d2327] text-sm mb-4">🔍 Homepage SEO</h2>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Homepage Meta Title</label>
                                <input type="text" value={settings.homepage_meta_title || ""}
                                  onChange={e => setSettings({ ...settings, homepage_meta_title: e.target.value })}
                                  placeholder="Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx"
                                  className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Homepage Meta Description</label>
                                <textarea rows={3} value={settings.homepage_meta_description || ""}
                                  onChange={e => setSettings({ ...settings, homepage_meta_description: e.target.value })}
                                  placeholder="Book premium airport transfers and luxury chauffeur services..."
                                  className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              </div>
                            </div>
                          </div>

                          {/* OG / Social Tags */}
                          <div className="md:col-span-2 border-t border-[#f0f0f1] pt-4">
                            <h2 className="font-bold text-[#1d2327] text-sm mb-4">📢 Open Graph / Social Tags</h2>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-semibold text-[#1d2327] mb-1">OG Title</label>
                                <input type="text" value={settings.og_title || ""}
                                  onChange={e => setSettings({ ...settings, og_title: e.target.value })}
                                  placeholder="Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx"
                                  className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#1d2327] mb-1">OG Description</label>
                                <textarea rows={2} value={settings.og_description || ""}
                                  onChange={e => setSettings({ ...settings, og_description: e.target.value })}
                                  placeholder="Book premium airport transfers..."
                                  className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-[#1d2327] mb-1">OG Image URL</label>
                                <input type="text" value={settings.og_image || ""}
                                  onChange={e => setSettings({ ...settings, og_image: e.target.value })}
                                  placeholder="https://travelluxx.co.uk/og-image.jpg"
                                  className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                                <p className="text-[#646970] text-[10px] mt-1">Recommended: 1200×630 px. Shown when shared on Facebook, Twitter, WhatsApp, etc.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === "connectors" && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="font-bold text-[#1d2327] text-sm mb-4 pb-2 border-b border-[#f0f0f1] flex items-center gap-2">
                            💳 Mollie Payment Gateway
                          </h2>
                          <div>
                            <label className="block text-xs font-semibold text-[#1d2327] mb-1">Mollie API Key (Live / Test)</label>
                            <input type="password" value={settings.mollie_api_key || ""}
                              onChange={e => setSettings({ ...settings, mollie_api_key: e.target.value })}
                              placeholder="live_... or test_..."
                              className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                            <p className="text-[#646970] text-[10px] mt-1">This updates your local .env file MOLLIE_API_KEY automatically.</p>
                          </div>
                        </div>

                        <div className="border-t border-[#f0f0f1] pt-4">
                          <h2 className="font-bold text-[#1d2327] text-sm mb-4 pb-2 border-b border-[#f0f0f1] flex items-center gap-2">
                            ⭐ Google My Business Reviews
                          </h2>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#1d2327] mb-1">GMB Place ID</label>
                              <input type="text" value={settings.gmb_place_id || ""}
                                onChange={e => setSettings({ ...settings, gmb_place_id: e.target.value })}
                                placeholder="ChIJ..."
                                className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              <p className="text-[#646970] text-[10px] mt-1">Find your Place ID at: developers.google.com/maps/documentation/javascript/examples/places-placeid-finder</p>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#1d2327] mb-1">Google Places API Key</label>
                              <input type="password" value={settings.gmb_api_key || ""}
                                onChange={e => setSettings({ ...settings, gmb_api_key: e.target.value })}
                                placeholder="AIza..."
                                className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                              <p className="text-[#646970] text-[10px] mt-1">Enable Places API in Google Cloud Console. Reviews sync automatically on each page load.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {settingsTab === "writing" && (
                      <div className="space-y-4">
                        <h2 className="font-bold text-[#1d2327] text-sm mb-4 pb-2 border-b border-[#f0f0f1]">
                          🚖 Default Pricing Rates (£ per mile)
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { key: "economy_price", label: "Economy" },
                            { key: "luxury_price", label: "Luxury" },
                            { key: "family_price", label: "Family" },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-xs font-semibold text-[#1d2327] mb-1">{f.label} (£)</label>
                              <input type="number" step="0.10" value={settings[f.key] || ""}
                                onChange={e => setSettings({ ...settings, [f.key]: parseFloat(e.target.value) })}
                                className="w-full border border-[#8c8f94] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] bg-white text-black" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}



                    <div className="pt-4 border-t border-[#f0f0f1] flex justify-end">
                      <button type="submit" disabled={isSaving}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50">
                        {isSaving ? (
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#f0f0f1]">
              <div>
                <span className="font-mono text-[#2271b1] font-bold text-sm">{selectedBooking.id}</span>
                <h3 className="font-bold text-[#1d2327]">Lead Details</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-[#646970] hover:text-[#1d2327] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Passenger</span>
                  <span className="text-[#1d2327] font-bold">{selectedBooking.passengerName}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Phone</span>
                  <span className="text-[#1d2327] font-bold">{selectedBooking.passengerPhone}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1] col-span-2">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Email</span>
                  <span className="text-[#1d2327]">{selectedBooking.passengerEmail}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1] col-span-2">
                  <span className="text-emerald-600 font-bold block">Pickup: </span>{selectedBooking.pickup}
                  <span className="text-red-500 font-bold block mt-1">Dropoff: </span>{selectedBooking.dropoff}
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Date & Time</span>
                  <span className="text-[#1d2327] font-bold">{selectedBooking.date} {selectedBooking.time}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Total Fare</span>
                  <span className="text-[#2271b1] font-extrabold text-base">£{Number(selectedBooking.price || 0).toFixed(2)}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Vehicle</span>
                  <span className="text-[#1d2327] font-bold">{selectedBooking.vehicle} Class</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Payment</span>
                  <span className="text-[#1d2327]">{selectedBooking.paymentMethod} ({selectedBooking.paymentStatus || "Unpaid"})</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#f0f0f1] flex justify-end">
              <button onClick={() => setSelectedBooking(null)}
                className="bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#50575e] px-4 py-2 rounded text-sm font-semibold transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white shadow-xl rounded-sm w-full max-w-lg border border-[#c3c4c7]">
            <div className="bg-[#1d2327] p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Contact Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-[#a7aaad] hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Sender Name</span>
                  <span className="text-[#1d2327] font-bold">{selectedInquiry.name}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Phone Number</span>
                  <span className="text-[#1d2327] font-bold">{selectedInquiry.phone || "N/A"}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1] col-span-2">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Email Address</span>
                  <span className="text-[#1d2327]">{selectedInquiry.email}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Type / Subject</span>
                  <span className="text-[#2271b1] font-semibold">{selectedInquiry.type || "General Inquiry"}</span>
                </div>
                <div className="bg-[#f9f9f9] p-3 rounded border border-[#f0f0f1]">
                  <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Received At</span>
                  <span className="text-[#1d2327]">{selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleString() : "N/A"}</span>
                </div>
              </div>
              <div className="bg-[#f9f9f9] p-4 rounded border border-[#f0f0f1]">
                <span className="text-[#646970] text-[10px] uppercase font-semibold block mb-1">Message</span>
                <p className="text-[#1d2327] whitespace-pre-wrap text-sm leading-relaxed">{selectedInquiry.message}</p>
              </div>
            </div>
            <div className="p-4 border-t border-[#f0f0f1] flex justify-end gap-2">
              <button
                onClick={async () => {
                  await deleteInquiry(selectedInquiry.id);
                  setSelectedInquiry(null);
                }}
                className="bg-[#d63638] hover:bg-[#b32d2e] text-white px-4 py-2 rounded text-sm font-semibold transition"
              >
                Delete Inquiry
              </button>
              <button onClick={() => setSelectedInquiry(null)}
                className="bg-[#f0f0f1] hover:bg-[#dcdcde] text-[#50575e] px-4 py-2 rounded text-sm font-semibold transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMedia && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white shadow-xl rounded-sm w-full max-w-5xl border border-[#c3c4c7] flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            {/* Left side preview & button */}
            <div className="flex-1 bg-[#f1f1f1] flex flex-col items-center justify-center p-6 min-h-[300px] overflow-y-auto">
              <img src={selectedMedia} alt="media preview" className="max-w-full max-h-[60vh] object-contain border border-[#c3c4c7] bg-white shadow-sm" />
              <button className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white px-4 py-1.5 rounded-sm text-xs font-semibold mt-4 transition shadow-sm">
                Edit Image
              </button>
            </div>

            {/* Right side metadata/actions */}
            <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-[#c3c4c7] p-5 flex flex-col justify-between bg-white text-xs overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-[#ddd] pb-2">
                  <h3 className="font-bold text-[#2c3338] text-sm">Attachment details</h3>
                  <button onClick={() => setSelectedMedia(null)} className="text-[#a7aaad] hover:text-[#2c3338] transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Upload Meta */}
                <div className="text-[11px] text-[#646970] space-y-1">
                  <div>Uploaded on: {new Date().toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div>Uploaded by: <span className="text-[#2271b1]">admin</span></div>
                  <div>File name: {selectedMedia.split("/").pop()}</div>
                  <div>File type: image/webp</div>
                  <div>File size: 94 KB</div>
                  <div>Dimensions: 1666 by 944 pixels</div>
                </div>

                {/* Fields */}
                <div className="space-y-3 pt-2 border-t border-[#ddd]">
                  <div className="grid grid-cols-3 items-start gap-2">
                    <span className="font-semibold text-right text-[#2c3338] pt-1 text-[11px]">Alternative Text</span>
                    <div className="col-span-2">
                      <textarea
                        rows={2}
                        value={mediaAltText}
                        onChange={e => setMediaAltText(e.target.value)}
                        placeholder=""
                        className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                      />
                      <span className="text-[10px] text-[#646970] block mt-0.5"><a href="https://example.com" target="_blank" className="text-[#2271b1] hover:underline">Learn how to describe the purpose of the image</a>. Leave empty if the image is purely decorative.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-semibold text-right text-[#2c3338] text-[11px]">Title</span>
                    <input
                      type="text"
                      value={mediaTitleText}
                      onChange={e => setMediaTitleText(e.target.value)}
                      className="col-span-2 border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-start gap-2">
                    <span className="font-semibold text-right text-[#2c3338] pt-1 text-[11px]">Caption</span>
                    <textarea
                      rows={2}
                      value={mediaCaption}
                      onChange={e => setMediaCaption(e.target.value)}
                      className="col-span-2 w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-start gap-2">
                    <span className="font-semibold text-right text-[#2c3338] pt-1 text-[11px]">Description</span>
                    <textarea
                      rows={2}
                      value={mediaDescription}
                      onChange={e => setMediaDescription(e.target.value)}
                      className="col-span-2 w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <span className="font-semibold text-right text-[#2c3338] text-[11px]">File URL:</span>
                    <input
                      type="text"
                      readOnly
                      value={window.location.origin + selectedMedia}
                      onClick={e => (e.target as HTMLInputElement).select()}
                      className="col-span-2 border border-[#c3c4c7] bg-[#f0f0f1] rounded-sm px-2 py-1 text-xs font-mono select-all text-[#50575e] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + selectedMedia);
                        alert("URL copied!");
                      }}
                      className="col-span-2 border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white py-1 rounded-sm text-xs font-semibold text-center transition"
                    >
                      Copy URL to clipboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom footer links */}
              <div className="border-t border-[#ddd] pt-4 mt-6 flex justify-between items-center text-[11px] text-[#2271b1]">
                <div className="flex gap-2">
                  <a href={selectedMedia} target="_blank" className="hover:underline">View media file</a>
                  <span className="text-[#c3c4c7]">|</span>
                  <span className="hover:underline cursor-pointer">Edit more details</span>
                  <span className="text-[#c3c4c7]">|</span>
                  <a href={selectedMedia} download className="hover:underline">Download file</a>
                </div>
                <button
                  onClick={async () => {
                    await deleteMedia(selectedMedia);
                    setSelectedMedia(null);
                  }}
                  className="text-[#b32d2e] hover:text-[#d63638] font-semibold hover:underline"
                >
                  Delete permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WordPress style Add Media Modal */}
      {editorMediaModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
          <div className="bg-white shadow-xl rounded-sm w-full max-w-4xl border border-[#c3c4c7] flex flex-col overflow-hidden max-h-[85vh]">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#23282d]">Insert Media</h3>
              <button onClick={() => { setEditorMediaModalOpen(false); setSelectedEditorMediaUrl(null); }} className="text-[#a7aaad] hover:text-[#2c3338] transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-[400px]">
              {/* Media selection area (left) */}
              <div className="flex-1 p-5 overflow-y-auto bg-slate-50 border-r border-[#c3c4c7]">
                <div className="flex items-center justify-between mb-4 border-b border-[#ddd] pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#2c3338]">Media Library</span>
                    <button
                      type="button"
                      onClick={() => {
                        const fileInput = document.getElementById("modal-media-upload") as HTMLInputElement;
                        fileInput?.click();
                      }}
                      className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white px-2 py-1 rounded-sm text-xs font-semibold transition shadow-sm flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Files
                    </button>
                    <input
                      id="modal-media-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setUploading(true);
                          for (const file of Array.from(e.target.files) as File[]) {
                            try {
                              const base64Data = await toBase64(file);
                              const res = await fetch("/api/admin/upload", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ filename: file.name, data: base64Data })
                              });
                              const json = await res.json();
                              if (json.url) {
                                setMedia(prev => [json.url, ...prev]);
                                setSelectedEditorMediaUrl(json.url);
                              }
                            } catch (err) {
                              console.error("Modal upload failed:", err);
                            }
                          }
                          setUploading(false);
                          fetchMedia();
                        }
                      }}
                    />
                  </div>
                  <input type="text" placeholder="Search media..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="border border-[#c3c4c7] bg-white rounded-sm px-2 py-1 outline-none text-xs focus:border-[#2271b1]" />
                </div>

                {media.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {media.filter(url => url.toLowerCase().includes(searchQuery.toLowerCase())).map((url, i) => {
                      const isSelected = selectedEditorMediaUrl === url;
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedEditorMediaUrl(url);
                            const fname = url.split("/").pop() || "";
                            setEditorMediaTitleText(fname.split(".")[0] || fname);
                            setEditorMediaAltText("");
                            setEditorMediaCaption("");
                            setEditorMediaDescription("");
                          }}
                          className={`aspect-square bg-white border cursor-pointer relative overflow-hidden group shadow-sm ${isSelected ? "border-4 border-[#2271b1]" : "border-[#c3c4c7] hover:border-[#8c8f94]"}`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#2271b1] text-white rounded-full p-0.5 shadow">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-400">No media assets found. Upload some in the Media tab first!</div>
                )}
              </div>

              {/* Sidebar metadata & Insert Action (right) */}
              <div className="w-80 bg-[#f6f7f7] p-5 overflow-y-auto flex flex-col justify-between border-l border-[#c3c4c7]">
                {selectedEditorMediaUrl ? (
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-[#646970] border-b border-[#ddd] pb-1.5">Attachment Details</h4>
                    <div className="aspect-video bg-white border border-[#c3c4c7] flex items-center justify-center overflow-hidden rounded-sm mb-2 shadow-sm">
                      <img src={selectedEditorMediaUrl} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="text-[10px] text-[#646970] space-y-0.5">
                      <div>File name: {selectedEditorMediaUrl.split("/").pop()}</div>
                      <div>File type: image/webp</div>
                      <div>Dimensions: 1666 by 944 pixels</div>
                    </div>
                    <div className="space-y-3 pt-2 border-t border-[#ddd] text-xs">
                      <div>
                        <label className="block font-semibold text-[#2c3338] mb-1">Alternative Text</label>
                        <textarea
                          rows={2}
                          value={editorMediaAltText}
                          onChange={e => setEditorMediaAltText(e.target.value)}
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                        />
                        <span className="text-[9px] text-[#646970] block mt-0.5"><a href="https://example.com" target="_blank" className="text-[#2271b1] hover:underline">Learn how to describe the purpose of the image</a>.</span>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2c3338] mb-1">Title</label>
                        <input
                          type="text"
                          value={editorMediaTitleText}
                          onChange={e => setEditorMediaTitleText(e.target.value)}
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2c3338] mb-1">Caption</label>
                        <textarea
                          rows={2}
                          value={editorMediaCaption}
                          onChange={e => setEditorMediaCaption(e.target.value)}
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2c3338] mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editorMediaDescription}
                          onChange={e => setEditorMediaDescription(e.target.value)}
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1] text-[#2c3338]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#2c3338] mb-1">File URL</label>
                        <input
                          type="text"
                          readOnly
                          value={window.location.origin + selectedEditorMediaUrl}
                          className="w-full border border-[#c3c4c7] bg-[#f0f0f1] rounded-sm px-2 py-1 text-xs font-mono text-[#50575e] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + selectedEditorMediaUrl);
                            alert("URL copied!");
                          }}
                          className="w-full border border-[#2271b1] text-[#2271b1] bg-white hover:bg-slate-50 py-1 mt-1 text-[10px] font-semibold rounded-sm text-center transition"
                        >
                          Copy URL to clipboard
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[#646970] py-20 text-xs">Select an image from the library to insert.</div>
                )}

                <div className="border-t border-[#ddd] pt-4 mt-6 flex justify-end gap-2 text-xs">
                  <button onClick={() => { setEditorMediaModalOpen(false); setSelectedEditorMediaUrl(null); }}
                    className="border border-[#c3c4c7] hover:bg-slate-100 px-3 py-1.5 rounded-sm font-semibold transition bg-white text-[#50575e]">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedEditorMediaUrl) {
                        insertImageIntoEditor(selectedEditorMediaUrl, editorMediaAltText);
                      }
                    }}
                    disabled={!selectedEditorMediaUrl}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded-sm font-semibold shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Insert into post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
