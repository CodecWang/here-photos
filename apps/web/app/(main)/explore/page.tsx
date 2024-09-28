'use client';

import PageHeader from '~/components/page-header';

export default function Page() {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500">
      <PageHeader title="Explore"></PageHeader>

      <div className="flex items-center space-x-2 p-4">
        <span className="text-gray-600">Building</span>
        <span className="loading loading-ring loading-lg"></span>
      </div>

      <div
        className="flex space-x-2 px-4 pt-2"
        style={{
          animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
        }}
      >
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img src="/api/v1/photos/244/thumbnail?variant=2" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">People</h2>
          </div>
        </div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure>
            <img src="/api/v1/photos/257/thumbnail?variant=2" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Animals</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
