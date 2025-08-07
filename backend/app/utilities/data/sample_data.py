data = test_data = {
    "fullName": "Venkata Sai Kumar Jetti",
    "email": "venkatasaikumar.jetti@gmail.com",
    "phone": "240 457 5305",
    "linkedin": "https://linkedin.com/in/sai-jetti",
    "github": "https://github.com/sai-jetti",
    "summary": (
        " with a strong foundation in SQL, Python, and Power BI. "
        "Experienced in transforming large datasets into actionable insights and building "
        "interactive dashboards for business stakeholders."
    ),
    "education": [
        {
            "degree": "Master of Science in Data Science",
            "institution": "University of Maryland, Baltimore County",
            "gradStartMonth": "May",
            "gradStartYear": "2025",
            "gradEndMonth": "May",
            "gradEndYear": "2025",
            "isCurrent": True,
            "gpa": "3.8",
            "courses": "Big Data, Machine Learning, Deep Learning, Data Visualization"
        },
        {
            "degree": "Bachelor & of Technology in Electronics",
            "institution": "RVR & JC College of Engineering, India",
            "gpa": "3.5",
            "gradStartMonth": "Jul",
            "gradStartYear": "2017",
            "gradEndMonth": "Jul",
            "gradEndYear": "2021",
            "isCurrent": False,
            "courses": "Data Structures, Algorithms, Operating Systems, Computer Networks"
        }
    ],
    "experience": [
        {
            "jobTitle": "Data Analyst",
            "company": "Busy Squirrels",
            "startMonth": "Aug",
            "startYear": "2024",
            "endMonth": "Dec",
            "endYear": "2024",
            "isCurrent": False,
            "technologies": "SQL, Python, Power BI",
            "description": (
                "Developed Power BI dashboards, automated reports with Python, and performed in-depth analysis."
                "using SQL to support executive decision-making."
            )
        },
        {
            "jobTitle": "Math Tutor (Grades 7–8)",
            "company": "Baltimore County Public Schools",
            "startMonth": "Feb",
            "startYear": "2024",
            "endMonth": "May",
            "endYear": "2024",
            "isCurrent": False,
            "technologies": "Math Tutoring, Student Engagement",
            "description": (
                "Taught math concepts interactively, improved student engagement and outcomes. "
                "Awarded best tutor for two consecutive months."
            )
        }
    ],
    "projects": [
        {
            "title": "Bank Loan Report",
            "startMonth": "May",
            "startYear": "2024",
            "endMonth": "Jul",
            "endYear": "2024",
            "isCurrentlyWorking": False,
            "summary": "Analyzed bank loan datasets and generated actionable KPI reports.",
            "description": (
                "Cleaned and queried loan data using SQL and Python."
                "Created interactive Power BI dashboards with key financial insights."
            )
        },
        {
            "title": "Motor Vehicle Crash EDA",
            "startMonth": "Nov",
            "startYear": "2023",
            "endMonth": "Jan",
            "endYear": "2024",
            "isCurrentlyWorking": False,
            "summary": "Explored crash data to identify safety concerns and high-risk zones.",
            "description": (
                "Processed and visualized crash data trends by time, weather, and location."
                "Built multi-page dashboards to support urban planning decisions."
            )
        }
    ],
    "skills": [
        {
            "category": "Languages",
            "items": "Python, SQL, JavaScript, HTML, CSS"
        },
        {
            "category": "Frameworks",
            "items": "Flask, Django, React"
        },
        {
            "category": "Tools",
            "items": "Power BI, Tableau, Jupyter, Git"
        }
    ],
    "certifications": [
        {
            "name": "AWS Certified Developer – Associate",
            "issuer": "Amazon Web Services",
            "obtainedMonth": "May",
            "obtainedYear": "2023",
            "expiryMonth": "May",
            "expiryYear": "2026",
            "isCurrentlyValid": False
        },
        {
            "name": "Google Data Analytics",
            "issuer": "Google",
            "obtainedMonth": "Jan",
            "obtainedYear": "2024",
            "expiryMonth": None,
            "expiryYear": None,
            "isCurrentlyValid": True
        }
    ]
}

def get_sample_data():
    """
    Returns a sample data dictionary that can be used for testing or as a template.
    """
    return data