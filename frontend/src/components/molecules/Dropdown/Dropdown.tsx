import "./Dropdown.scss";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icon from "../../atoms/Icon/Icon";

interface ContentItem<T> {
  name: T;
  id: number;
}

interface DropDownProps<T> {
  label: string;
  contentList: ContentItem<T>[];
  onSelect?: (selectedItem: ContentItem<T>) => void;
}

export default function Dropdown<T extends string>({
  contentList,
  label,
  onSelect,
}: DropDownProps<T>) {
  const [opened, setOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem<T> | null>(null); // État unique pour la sélection
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setOpened(!opened);
  };

  const handleOptionClick = (item: ContentItem<T>) => {
    setSelectedItem(item);
    setOpened(false);

    if (onSelect) {
      onSelect(item);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpened(false);
    }
  };

  // Gestion de la navigation au clavier
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!opened) {
      if (event.key === "ArrowDown" || event.key === "Enter") {
        event.preventDefault();
        setOpened(true);
      }
      return;
    }

    const currentIndex = selectedItem
      ? contentList.findIndex((item) => item.id === selectedItem.id)
      : -1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex =
          currentIndex < contentList.length - 1 ? currentIndex + 1 : 0;
        setSelectedItem(contentList[nextIndex]);
        break;
      case "ArrowUp":
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : contentList.length - 1;
        setSelectedItem(contentList[prevIndex]);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (currentIndex !== -1) {
          handleOptionClick(contentList[currentIndex]);
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
        <Paragraph
          content={selectedItem ? selectedItem.name : label}
          size="big"
          color="white"
        />
        <Icon name="chevron" size="tiny" color="white" />
      </div>
      <div
        className={`dropdown-content ${opened ? "show" : ""}`}
        role="listbox"
      >
        {contentList.map((item, index) => (
          <div
            className={`option ${selectedItem?.id === item.id ? "active" : ""}`}
            key={index}
            onClick={() => handleOptionClick(item)}
            role="option"
            aria-selected={selectedItem?.id === item.id}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
