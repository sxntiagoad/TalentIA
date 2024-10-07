import React from 'react'
import { PostItem } from './PostItem'

export function ResultsGrid({ items=[], isService = true, title }) {
    return (
      <div className="w-full mx-auto px-10 py-4">
        {title && <h2 className="title-poppins mb-4 ">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="w-full">
              <PostItem item={item} isService={isService} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default ResultsGrid;