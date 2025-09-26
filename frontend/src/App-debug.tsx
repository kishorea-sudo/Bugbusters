

function DebugApp() {
  console.log('DebugApp rendering...');
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug App</h1>
        <p className="text-gray-600">If you can see this, the app is working!</p>
      </div>
    </div>
  );
}

export default DebugApp;