'use client';

interface MychatItemProps {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  tags: string[];
}

export default function MychatItem({ thumbnail, title, date, tags }: MychatItemProps) {
  return (
    <div className="cmp_prd">
      <a href="#" className="block">
        {/* Thumbnail */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          <span className="text-5xl">{thumbnail}</span>
        </div>

        {/* Product Info */}
        <div className="link_info">
          <span className="txt_brand">{date}</span>
          <span className="txt_prdname">{title}</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
