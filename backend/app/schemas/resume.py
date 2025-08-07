from typing import List, Optional
from pydantic import BaseModel, field_validator
import re

def escape_latex(text: str) -> str:
    if not text:
        return text
    return re.sub(r'([%&_#{}$])', r'\\\1', text)

def clean_wrapped_lines(v: str) -> List[str]:
    if not isinstance(v, str):
        return v

    # Restore real paragraph breaks
    cleaned_lines = [line.strip() for line in v.split('\n') if line.strip()]
    return cleaned_lines

# added gpa
class Education(BaseModel):
    degree: str
    institution: str
    gpa: str
    gradStartMonth: str
    gradStartYear: str
    gradEndMonth: Optional[str] = None
    gradEndYear: Optional[str] = None
    isCurrent: bool
    courses: str

    @field_validator('degree', 'institution', 'courses', 'gpa', mode='before')
    @classmethod
    def escape_edu_text(cls, v):
        return escape_latex(v)

# added skills item
class Experience(BaseModel):
    jobTitle: str
    company: str
    startMonth: str
    startYear: str
    endMonth: Optional[str] = None
    endYear: Optional[str] = None
    isCurrent: bool
    technologies: str
    description: List[str]

    @field_validator('jobTitle', 'company', 'technologies', mode='before')
    @classmethod
    def escape_exp_text(cls, v):
        return escape_latex(v)

    @field_validator('description', mode='before')
    @classmethod
    def convert_description_to_list(cls, v):
        v = escape_latex(v)  # Escape LaTeX characters in description
        return clean_wrapped_lines(v)

class Project(BaseModel):
    title: str
    startMonth: str
    startYear: str
    endMonth: Optional[str] = None
    endYear: Optional[str] = None
    isCurrentlyWorking: bool
    summary: str
    description: List[str]

    @field_validator('title', 'summary', mode='before')
    @classmethod
    def escape_pro_text(cls, v):
        return escape_latex(v)
    
    @field_validator('description', mode='before')
    @classmethod
    def convert_description_to_list(cls, v):
        v = escape_latex(v)
        return clean_wrapped_lines(v)

class SkillItem(BaseModel):
    category: str
    items: str

    @field_validator('category', 'items', mode='before')
    @classmethod
    def escape_skill_text(cls, v):
        return escape_latex(v)

# isCurrentlyValid refres to doesCertificate expire or not
class Certification(BaseModel):
    name: str
    issuer: str
    obtainedMonth: str
    obtainedYear: str
    expiryMonth: Optional[str] = None
    expiryYear: Optional[str] = None
    isCurrentlyValid: bool

    @field_validator('name', 'issuer', mode='before')
    @classmethod
    def escape_cert_text(cls, v):
        return escape_latex(v)

class ResumeData(BaseModel):
    fullName: str
    email: str
    phone: str
    linkedin: str
    github: str
    summary: str
    education: List[Education]
    experience: List[Experience]
    projects: List[Project]
    skills: List[SkillItem]
    certifications: List[Certification]
