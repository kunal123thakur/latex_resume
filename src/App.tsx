import { useState } from 'react';
import { FileText } from 'lucide-react';

const defaultLatex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\pagestyle{empty}

\\begin{document}

\\begin{center}
{\\LARGE \\textbf{John Doe}}\\\\[0.5em]
{\\large Software Engineer}\\\\[0.5em]
john.doe@email.com | (555) 123-4567 | github.com/johndoe
\\end{center}

\\section*{Summary}
Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading high-performing teams.

\\section*{Experience}

\\textbf{Senior Software Engineer} \\hfill \\textit{Jan 2021 -- Present}\\\\
Tech Company Inc., San Francisco, CA
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Led development of microservices architecture serving 1M+ users
  \\item Improved application performance by 40\\% through optimization
  \\item Mentored team of 5 junior developers
\\end{itemize}

\\textbf{Software Engineer} \\hfill \\textit{Jun 2018 -- Dec 2020}\\\\
Startup Solutions, New York, NY
\\begin{itemize}[leftmargin=*,noitemsep]
  \\item Built responsive web applications using React and TypeScript
  \\item Implemented CI/CD pipelines reducing deployment time by 60\\%
  \\item Collaborated with designers to create intuitive user interfaces
\\end{itemize}

\\section*{Education}

\\textbf{Bachelor of Science in Computer Science} \\hfill \\textit{2014 -- 2018}\\\\
University of California, Berkeley

\\section*{Skills}

\\textbf{Languages:} JavaScript, TypeScript, Python, Java\\\\
\\textbf{Frameworks:} React, Node.js, Express, Next.js\\\\
\\textbf{Tools:} Git, Docker, AWS, MongoDB, PostgreSQL

\\end{document}`;

function App() {
  const [latexCode, setLatexCode] = useState(defaultLatex);

  const renderLatexToHtml = (latex: string): string => {
    let html = latex;

    html = html.replace(/\\documentclass\[.*?\]\{.*?\}/g, '');
    html = html.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '');
    html = html.replace(/\\pagestyle\{.*?\}/g, '');
    html = html.replace(/\\begin\{document\}/g, '');
    html = html.replace(/\\end\{document\}/g, '');

    html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '<div class="text-center mb-6">$1</div>');

    html = html.replace(/\{\\LARGE\s+\\textbf\{(.*?)\}\}/g, '<h1 class="text-3xl font-bold">$1</h1>');
    html = html.replace(/\{\\large\s+(.*?)\}/g, '<h2 class="text-xl mt-2">$1</h2>');
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');

    html = html.replace(/\\section\*\{(.*?)\}/g, '<h3 class="text-xl font-bold mt-6 mb-3 border-b-2 border-gray-300 pb-1">$1</h3>');

    html = html.replace(/\\begin\{itemize\}(\[.*?\])?([\s\S]*?)\\end\{itemize\}/g, (_, opts, content) => {
      const items = content
        .split('\\item')
        .slice(1)
        .map((item: string) => `<li class="ml-6 mb-1">${item.trim()}</li>`)
        .join('');
      return `<ul class="list-disc mb-3">${items}</ul>`;
    });

    html = html.replace(/\\hfill/g, '<span class="float-right"></span>');
    html = html.replace(/\\\\\[.*?\]/g, '<br>');
    html = html.replace(/\\\\/g, '<br>');
    html = html.replace(/\$\|/g, '|');
    html = html.replace(/\|\$/g, '|');

    html = html.replace(/\\%/g, '%');

    html = html.split('\n')
      .filter(line => line.trim())
      .map(line => {
        if (line.includes('<h') || line.includes('<div') || line.includes('<ul') || line.includes('</')) {
          return line;
        }
        return `<p class="mb-2">${line}</p>`;
      })
      .join('\n');

    return html;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Real-time LaTeX Resume Previewer
          </h1>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              LaTeX Editor
            </h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Paste your LaTeX code here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="w-1/2 bg-gray-100 flex flex-col">
          <div className="px-6 py-3 border-b border-gray-300 bg-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Live Preview
            </h2>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-4xl mx-auto">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderLatexToHtml(latexCode) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
