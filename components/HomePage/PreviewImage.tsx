export function PreviewImage() {
  return (
    <div className="lg:top-4 lg:sticky lg:overflow-hidden">
      <div className="group relative m-auto w-[90%] lg:max-w-full max-w-md perspective-1000">
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-40 rounded-xl transition duration-500 blur"></div>
        <img
          alt="System Preview"
          src="/dash.png"
          className="relative bg-gray-900 shadow-2xl rounded-xl ring-1 ring-gray-400/10 w-full group-hover:rotate-1 group-hover:scale-[1.02] transition-transform duration-500"
        />
      </div>
    </div>
  );
}
