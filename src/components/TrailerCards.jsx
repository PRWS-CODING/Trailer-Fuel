import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./TrailerCards.css";

function TrailerCards() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trailerData, setTrailerData] = useState([]);

  const fetchTrailers = async () => {
    if (!supabase) {
      console.warn("Supabase client is null. Skipping fetch.");
      return;
    }

    const { data, error } = await supabase
      .from("trailers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setTrailerData(data);
  };

  useEffect(() => {
    if (isExpanded) {
      fetchTrailers();

      // Subscribe to real-time changes to keep the list updated and sorted
      const channel = supabase
        .channel("trailers-realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "trailers" },
          () => {
            fetchTrailers(); // Refresh the list whenever data is inserted or updated
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
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
          {trailerData.length === 0 ? (
            <p className="no-data">No logs found. Enter data above to begin.</p>
          ) : (
            trailerData.map((item) => (
              <div key={item.id} className="trailer-card">
                <div className="trailer-number">
                  Trailer #{item.trailer_number}
                </div>
                <div className="trailer-details">
                  <p>
                    <strong>Hours:</strong> {item.hours.toLocaleString()}
                  </p>
                  <p>
                    <strong>Fuel:</strong> {parseFloat(item.fuel).toFixed(2)}{" "}
                    gal
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TrailerCards;
