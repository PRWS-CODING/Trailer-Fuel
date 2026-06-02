import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./TrailerCards.css";

function TrailerCards() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trailerData, setTrailerData] = useState([]);

  useEffect(() => {
    const fetchTrailers = async () => {
      if (!supabase) {
        console.warn("Supabase client is null. Skipping fetch.");
        return;
      }

      const { data, error } = await supabase
        .from("trailers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setTrailerData(data);
    };

    if (isExpanded) fetchTrailers();
  }, [isExpanded]);

  return (
    <div className="trailer-container">
      <div className="toggle-wrapper">
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Logs ▲" : "Show Logs ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="trailer-list">
          {trailerData.map((item) => (
            <div key={item.id} className="trailer-card">
              <div className="trailer-number">{item.trailer_number}</div>
              <div className="trailer-details">
                <p>
                  <strong>Hours:</strong> {item.hours}
                </p>
                <p>
                  <strong>Fuel:</strong> {item.fuel} gal
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrailerCards;
