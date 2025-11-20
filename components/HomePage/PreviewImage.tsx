export function PreviewImage() {
  return (
    <div className="lg:sticky lg:top-4 lg:overflow-hidden">
      <div className="relative w-[90%] max-w-md lg:max-w-full group perspective-1000 m-auto">
        <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
        <img
          alt="System Preview"
          src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
          className="relative w-full rounded-xl bg-gray-900 shadow-2xl ring-1 ring-gray-400/10 transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1"
        />
      </div>
    </div>
  );
}
