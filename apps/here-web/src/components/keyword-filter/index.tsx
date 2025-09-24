interface TagFilterProps {
  className?: string;
  keywords?: string[];
  selectedKeyword: string | null;
  onKeywordChange: (keyword: string | null) => void;
}

export default function KeywordFilter({
  className,
  keywords,
  selectedKeyword,
  onKeywordChange,
}: TagFilterProps) {
  if (!keywords?.length) return null;

  return (
    <form className={className} onReset={() => onKeywordChange(null)}>
      <input className="btn btn-square" type="reset" value="×" />
      {keywords.map((key) => (
        <input
          key={key}
          className="btn"
          type="radio"
          name="tags"
          aria-label={key}
          checked={selectedKeyword === key}
          onChange={() => onKeywordChange(key)}
        />
      ))}
    </form>
  );
}
