from jinja2 import Environment
from app.utilities.data.sample_data import get_sample_data
from app.services.generate_pdf import generate_pdf_from_tex

header = r"""
{% raw %}
\documentclass[a4paper,11pt]{article}

% paragraph spacing
\usepackage{parskip} 

% fonts
\usepackage{fontspec}
% setting font
\setmainfont{Times New Roman}

% colors
\usepackage[usenames,dvipsnames]{xcolor}
\definecolor{myteal}{HTML}{006d6d}

% margins
\usepackage[scale=0.9, top=.1in, bottom=.1in, left=0.3in, right=0.3in]{geometry}

% tables
\usepackage{tabularx}

% lists
\usepackage{enumitem}

% custom titles
\usepackage{titlesec}
\titlespacing{\section}{5pt}{5pt}{5pt}

\titleformat{\section}
  {\large\bfseries\raggedright\color{myteal}} % formatting
  {}{0em}
  {\uppercase} % this wraps the section title
  [\color{black}\titlerule]

% centering the contact info section
\newcolumntype{C}{>{\centering\arraybackslash}X} 	

% hyperlinks
\usepackage[unicode, draft=false]{hyperref}

\begin{document}
% non-numbered pages
\pagestyle{empty}
{% endraw %}
"""

personal_info = r"""
\begin{tabularx}{\linewidth}{@{} C @{}}
\color{myteal} \LARGE\bfseries{{"{"}}{{ fullName }}{{"}"}}\\[8pt]
{\href{mailto:{{ email }}}{{"{"}}{{ email }}{{"}"}} $|$}
{\href{tel:{{ phone|replace(' ', '') }}}{{"{"}}{{ phone }}{{"}"}} $|$}
{\href{{"{"}}{{ linkedin }}{{"}"}}{{"{"}}{{ linkedin|replace('https://www.', '') }}{{"}"}} $|$}
{\href{{"{"}}{{ github }}{{"}"}}{{"{"}}{{ github|replace('https://github.com/', 'github.com/') }}{{"}"}}}
\end{tabularx}
"""

summary = r"""
\section{Summary}
\vspace{1pt}
{{ summary }}
"""

experience = r"""
{% if experience %}
\section{Experience}{% for exp in experience %}
\textbf{{"{"}}{{ exp.company }}{{"}"}} \hfill {{ exp.startMonth }} {{ exp.startYear }}{% if exp.isCurrent %} - Current{% else %} - {{ exp.endMonth }} {{ exp.endYear }}{% endif %}\\[1pt]
\textbf{\textit{{"{"}}{{ exp.jobTitle }}{{"}"}}}\ \hfill \textbf{\textit{{"{"}}{{ exp.technologies }}{{"}"}}}\vspace{-5pt}
{% if exp.description %}\begin{itemize}[nosep, after=\strut, leftmargin=1em, itemsep=0.8pt]{% for point in exp.description %}
    \item {{ point }}{% endfor %}
    \end{itemize}{% endif %}
{% endfor %}
{% endif %}
"""

skills = r"""
{% if skills %}
\section{Technical Skills}
\begin{itemize}[nosep, after=\strut, leftmargin=1em, itemsep=1pt]{% for skill in skills %}
\item \textbf{{"{"}}{{ skill.category }}{{"}"}} \hspace*{1em} {{ skill["items"] }}{% endfor %}
\end{itemize}
{% endif %}
"""

projects = r"""
{% if projects %}
\section{Projects}{% for proj in projects %}
\textbf{{"{"}}{{ proj.title }}{{"}"}} \hfill {{ proj.startMonth }} {{ proj.startYear }}{% if proj.isCurrentlyWorking %} – Current{% else %} - {{ proj.endMonth }} {{ proj.endYear }}{% endif %}\\[1pt]
\textbf{\textit{{"{"}}{{ proj.summary }}{{"}"}}}\vspace{-5pt}
{% if proj.description %}\begin{itemize}[nosep, after=\strut, leftmargin=1em, itemsep=0.8pt]
    {% for point in proj.description %}
    \item {{ point }}{% endfor %}
    \end{itemize}{% endif %}
{% endfor %}
{% endif %}
"""

education = r"""
{% if education %}
\section{Education}{% for edu in education %}
\textbf{{"{"}}{{ edu.institution }}{{"}"}} \hfill {{ edu.gradStartMonth }} {{ edu.gradStartYear }}{% if edu.isCurrent %} - Current{% else %} - {{ edu.gradEndMonth }} {{ edu.gradEndYear }}{% endif %}\\
\textbf{\textit{{"{"}}{{ edu.degree }}{{"}"}}} \hfill \textit{\textbf{GPA:{{ edu.gpa }}{{"}"}}}{% if edu.courses %}\\ 
\textbf{Courses}:{{ edu.courses }}{% endif %}
{% endfor %}
{% endif %}
"""

certifications = r"""
{% if certifications %}
\section{Certifications}
\begin{itemize}[nosep, after=\strut, leftmargin=0.8em, itemsep=0.8pt]{% for cert in certifications %}
    \item \textbf{{"{"}}{{ cert.name }}{{"}"}}\\
    {{ cert.issuer }} \hfill {{ cert.obtainedMonth }} {{ cert.obtainedYear }}{% if cert.isCurrentlyValid %}{% else %}- {{ cert.expiryMonth }} {{ cert.expiryYear }}{% endif %}{% endfor %}\end{itemize}
{% endif %}
"""

footer = r"""
{% raw %}
\end{document}
{% endraw %}
"""


sections_dict = {
    "personal_info": personal_info,
    "summary": summary,
    "experience": experience,
    "skills": skills,
    "projects": projects,
    "education": education,
    "certifications": certifications,
}

def build_renderer(section_dict, header, footer):
    env = Environment()
    compiled_sections = {name: env.from_string(template) for name, template in section_dict.items()}
    base_template = env.from_string(
        header + "\n" +
        "\n".join(f"{{{{ {name} }}}}" for name in compiled_sections) +
        footer
    )

    return base_template, compiled_sections

def render_resume(base_template, compiled_sections, data):
        rendered = {name: tmpl.render(data) for name, tmpl in compiled_sections.items()}
        return base_template.render(**rendered)

def render_resume_to_file(data):
    """
    Renders the resume using the provided sections and returns the rendered LaTeX code.
    """
    base_template, compiled_sections = build_renderer(sections_dict, header, footer)

    rendered_tex = render_resume(base_template, compiled_sections, data)

    print("Rendered LaTeX code")

    with open("app/utilities/data/resume.tex", "w", encoding='utf-8') as f:
        f.write(rendered_tex)

    return generate_pdf_from_tex(rendered_tex, "app/utilities/data", "resume")

# uncomment for testing
# print(render_resume_to_file(get_sample_data()))