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

  // Fix unclosed div in loading blocks
  // specifically: </div>\n          </DashboardLayout>\n    );
  // Wait, right now it is: </DashboardLayout>\n    );
  // Let's find "Loading " text and after it there's a </div>, then </DashboardLayout>
  // Actually, let's just replace:
  // </DashboardLayout>\n    );
  // with
  // </div>\n      </DashboardLayout>\n    );
  // BUT only for the loading block. The main block is fine because it didn't have the inner div replaced incorrectly.
  // Wait, the script replaced all occurrences of `</main></div></div>);`!
  // In the main block, it replaced it. The main block didn't have a `<div className="flex h-full...` wrapper!
  // It just had `<DashboardLayout>`. So the main block didn't need a `</div>`.
  // Wait, if I replace the loading block closing:
  content = content.replace(/<\/svg>\n\s*Loading.*?\n\s*<\/div>\n\s*<\/DashboardLayout>/g, 
    (match) => match.replace("</DashboardLayout>", "</div>\n      </DashboardLayout>")
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
});
