function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Tailwind funciona!
        </h1>
        <p className="text-slate-600">
          si ves este fondo oscuro, el botón azul y el texto centrado, tu config
          manual es perfecta.
        </p>
        <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default App;
