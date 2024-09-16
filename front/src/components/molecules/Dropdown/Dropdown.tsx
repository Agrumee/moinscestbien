import "./Dropdown.scss";
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icon from "../../atoms/Icon/Icon";

interface ContentItem {
  name: string;
  id: string;
}

interface DropDownProps {
  label: string;
  contentList: ContentItem[];
  onSelect?: (selectedItem: ContentItem) => void; // Modifié pour accepter une fonction ou être undefined
}

export default function Dropdown({
  contentList,
  label,
  onSelect,
}: DropDownProps) {
  const [opened, setOpened] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setOpened(!opened);
    if (!opened) {
      setActiveIndex(null);
    }
  };

  const handleOptionClick = (name: string, id: string) => {
    setSelectedValue(name);
    setOpened(false);

    if (onSelect) {
      onSelect({ name, id });
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpened(false);
      setActiveIndex(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (
          opened &&
          activeIndex !== null &&
          activeIndex < contentList.length - 1
        ) {
          setActiveIndex((prevIndex) =>
            prevIndex !== null ? prevIndex + 1 : 0
          );
        } else if (!opened) {
          setOpened(true);
          setActiveIndex(0);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (opened && activeIndex !== null && activeIndex > 0) {
          setActiveIndex((prevIndex) =>
            prevIndex !== null ? prevIndex - 1 : 0
          );
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (opened && activeIndex !== null) {
          const selectedItem = contentList[activeIndex];
          handleOptionClick(selectedItem.name, selectedItem.id);
        } else {
          setOpened(true);
          setActiveIndex(0);
        }
        break;
      case "Tab":
        setOpened(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-haspopup="listbox"
      aria-expanded={opened}
    >
      <div
        className="m-icon-item"
        onClick={toggleDropdown}
        aria-label="Toggle dropdown"
      >
        <Paragraph content={selectedValue || label} size="big" color="black" />
        <Icon name="chevron" size="tiny" color="black" />
      </div>
      <div
        className={`dropdown-content ${opened ? "show" : ""}`}
        role="listbox"
      >
        {contentList.map((item, index) => (
          <div
            className={`option ${activeIndex === index ? "active" : ""}`}
            key={index}
            onClick={() => handleOptionClick(item.name, item.id)}
            role="option"
            aria-selected={activeIndex === index}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
