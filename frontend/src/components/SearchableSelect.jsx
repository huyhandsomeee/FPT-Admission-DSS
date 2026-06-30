import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, X } from "lucide-react";

/**
 * A searchable dropdown select component with Vietnamese diacritics-aware search.
 * Replaces native <select> with a custom dropdown that supports typing to filter.
 */
export default function SearchableSelect({
  options = [],        // [{ value, label }]
  value = "",
  onChange,
  placeholder = "Chọn thông tin",
  disabled = false,
  required = false,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Find selected label
  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : "";

  // Remove Vietnamese diacritics for fuzzy matching
  const removeDiacritics = useCallback((str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  }, []);

  // Filter options
  const filtered = search
    ? options.filter(o => {
        const labelNorm = removeDiacritics(o.label.toLowerCase());
        const searchNorm = removeDiacritics(search.toLowerCase());
        return labelNorm.includes(searchNorm) || o.label.toLowerCase().includes(search.toLowerCase());
      })
    : options;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightIdx]) {
        items[highlightIdx].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIdx]);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightIdx(-1);
  }, [search]);

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (opt) => {
    onChange(opt.value);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIdx >= 0 && filtered[highlightIdx]) {
        handleSelect(filtered[highlightIdx]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }} id={id}>
      {/* Trigger button */}
      <div
        onClick={handleOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "10px",
          border: isOpen ? "1.5px solid #F97316" : "1px solid #CBD5E1",
          backgroundColor: disabled ? "#F8FAFC" : "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          minHeight: "42px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: isOpen ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{
          color: displayLabel ? "#1E293B" : "#94A3B8",
          fontSize: "14px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}>
          {displayLabel || placeholder}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          {value && !disabled && (
            <span
              onClick={handleClear}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#E2E8F0",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#CBD5E1"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#E2E8F0"}
            >
              <X size={11} color="#64748B" />
            </span>
          )}
          <ChevronDown
            size={16}
            color="#64748B"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          />
        </div>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            animation: "searchableDropIn 0.15s ease-out",
          }}
        >
          <style>{`
            @keyframes searchableDropIn {
              from { opacity: 0; transform: translateY(-6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Search input */}
          <div style={{
            padding: "10px 12px",
            borderBottom: "1px solid #F1F5F9",
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "13px",
                  color: "#1E293B",
                  width: "100%",
                  fontFamily: "inherit",
                }}
              />
              {search && (
                <span
                  onClick={() => setSearch("")}
                  style={{ cursor: "pointer", display: "flex" }}
                >
                  <X size={13} color="#94A3B8" />
                </span>
              )}
            </div>
          </div>

          {/* Options list */}
          <div
            ref={listRef}
            style={{
              maxHeight: "220px",
              overflowY: "auto",
              padding: "4px 0",
            }}
          >
            {filtered.length === 0 ? (
              <div style={{
                padding: "16px",
                textAlign: "center",
                color: "#94A3B8",
                fontSize: "13px",
              }}>
                Không tìm thấy kết quả
              </div>
            ) : (
              filtered.map((opt, idx) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  style={{
                    padding: "9px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: opt.value === value ? "#F97316" : "#334155",
                    fontWeight: opt.value === value ? "600" : "400",
                    backgroundColor:
                      idx === highlightIdx
                        ? "#FFF7ED"
                        : opt.value === value
                          ? "#FFFBF5"
                          : "transparent",
                    transition: "background-color 0.1s",
                    borderLeft: opt.value === value ? "3px solid #F97316" : "3px solid transparent",
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>

          {/* Footer with count */}
          {options.length > 10 && (
            <div style={{
              padding: "6px 16px",
              borderTop: "1px solid #F1F5F9",
              fontSize: "11px",
              color: "#94A3B8",
              textAlign: "right",
              backgroundColor: "#FAFBFC",
            }}>
              {filtered.length}/{options.length} kết quả
            </div>
          )}
        </div>
      )}
    </div>
  );
}
