const fs = require('fs');
const path = require('path');

const filesToRefactor = [
  'app/interview/page.jsx',
  'app/jobs/page.jsx',
  'app/profile/page.jsx',
  'app/reports/[id]/page.jsx',
  'app/reports/page.jsx',
  'app/upload/page.jsx'
];

filesToRefactor.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace imports
  content = content.replace(/import Navbar from '@\/app\/components\/Navbar';\s*import Sidebar from '@\/app\/components\/Sidebar';/g, "import DashboardLayout from '@/app/components/DashboardLayout';");

  // Replace the loading state block
  content = content.replace(/<div className="min-h-screen bg-gray-900 flex flex-col">\s*<Navbar \/>\s*<div className="flex flex-1 overflow-hidden">\s*<Sidebar \/>\s*<main className="flex-1 flex items-center justify-center">/g, 
    '<DashboardLayout>\n        <div className="flex h-full items-center justify-center">');
  
  // Replace the main block top wrapper
  content = content.replace(/<div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">\s*(?:{.*?}\s*)?<Navbar \/>\s*(?:{.*?}\s*)?<div className="flex flex-1 overflow-hidden">\s*(?:{.*?}\s*)?<Sidebar \/>\s*(?:{.*?}\s*)?<main className="flex-1 p-8 overflow-y-auto">/g, 
    '<DashboardLayout>');
  content = content.replace(/<div className="min-h-screen bg-gray-900 flex flex-col">\s*(?:{.*?}\s*)?<Navbar \/>\s*(?:{.*?}\s*)?<div className="flex flex-1 overflow-hidden">\s*(?:{.*?}\s*)?<Sidebar \/>\s*(?:{.*?}\s*)?<main className="flex-1 p-8 overflow-y-auto">/g, 
    '<DashboardLayout>');

  // Some pages have print specific padding
  content = content.replace(/<div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">\s*<Navbar \/>\s*<div className="flex flex-1 overflow-hidden">\s*<Sidebar \/>\s*<main className="flex-1 p-8 overflow-y-auto print:p-0 print:bg-white print:text-black">/g, 
    '<DashboardLayout>');

  // Replace the closing tags for loading state and main state
  // This is tricky because it might replace too many or too few. 
  // Let's specifically target the ending tags before `);`
  content = content.replace(/<\/main>\s*<\/div>\s*<\/div>\s*\);/g, '</DashboardLayout>\n    );');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Refactored ${filePath}`);
});
