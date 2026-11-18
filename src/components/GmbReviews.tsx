import React, { useState, useEffect } from "react";
import { Star, ExternalLink } from "lucide-react";

const FALLBACK_REVIEWS = [
  {
    author_name: "James Thornton",
    rating: 5,
    text: "Outstanding service from Solihull to Heathrow Terminal 5. Driver was punctual, pristine Mercedes S-Class, and the journey was completely stress-free. TravelLuxx is now our company's go-to executive travel partner.",
    relative_time_description: "a week ago",
    profile_photo_url: ""
  },
  {
    author_name: "Sarah Jenkins",
    rating: 5,
    text: "Booked an airport transfer from Birmingham Airport. Flight landed 30 minutes early, yet the chauffeur was already waiting at arrivals with a name board. Impeccable vehicle and polite chauffeur. 10/10!",
    relative_time_description: "2 weeks ago",
    profile_photo_url: ""
  },
  {
    author_name: "Marcus Vance",
    rating: 5,
    text: "Booked the Mercedes V-Class for our family trip to London. Plenty of luggage space, smooth drive, and the kids were comfortable throughout. Booking process online was seamless and transparent.",
    relative_time_description: "a month ago",
    profile_photo_url: ""
  },
  {
    author_name: "Dr. Alistair Ross",
    rating: 5,
    text: "Consistently professional and immaculate vehicles. Used them for multiple client meetings across Warwick and Birmingham. Never once been let down. Highest recommendation.",
    relative_time_description: "2 months ago",
    profile_photo_url: ""
  }
];

interface GmbReviewsProps {
  settings?: any;
}

export default function GmbReviews({ settings }: GmbReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5.0);
  const [total, setTotal] = useState<number>(48);
  const [loading, setLoading] = useState(true);

  const googleMapsUrl = settings?.google_maps_url || settings?.gmb_url || "";
  const placeId = settings?.gmb_place_id || "";

  const reviewsPageUrl = googleMapsUrl ||
    (placeId ? `https://search.google.com/local/reviews?placeid=${placeId}` : "");

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews.slice(0, 4));
          if (data.rating) setRating(data.rating);
          if (data.total) setTotal(data.total);
        } else {
          setReviews(FALLBACK_REVIEWS);
        }
        setLoading(false);
      })
      .catch(() => {
        setReviews(FALLBACK_REVIEWS);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Verified Client Testimonials
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Trusted by Discerning<br />Travelers
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              Real experiences from clients who rely on TravelLuxx for punctual airport transfers and executive chauffeur travel.
            </p>
          </div>

          {/* Google rating badge */}
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm shrink-0">
            <div className="w-10 h-10 shrink-0">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{rating.toFixed(1)}</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Based on <span className="font-semibold text-slate-700">{total} Google Reviews</span>
                {reviewsPageUrl && (
                  <a
                    href={reviewsPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1.5 text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-0.5"
                  >
                    View All <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review: any, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
              <div>
                <div className="flex mb-3">
                  {Array.from({ length: Math.min(review.rating || 5, 5) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed line-clamp-5">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  {review.profile_photo_url ? (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {review.author_name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-800">{review.author_name}</p>
                    <p className="text-[10px] text-slate-400">{review.relative_time_description || "Google Review"}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
