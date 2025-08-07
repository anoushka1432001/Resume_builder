from typing import List, Optional
from pydantic import BaseModel

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

class Experience(BaseModel):
    jobTitle: str
    company: str
    startMonth: str
    startYear: str
    endMonth: Optional[str] = None
    endYear: Optional[str] = None
    isCurrent: bool
    technologies: str
    description: str

class Project(BaseModel):
    title: str
    startMonth: str
    startYear: str
    endMonth: Optional[str] = None
    endYear: Optional[str] = None
    isCurrentlyWorking: bool
    summary: str
    description: str

class SkillItem(BaseModel):
    category: str
    items: str

class Certification(BaseModel):
    name: str
    issuer: str
    obtainedMonth: str
    obtainedYear: str
    expiryMonth: Optional[str] = None
    expiryYear: Optional[str] = None
    isCurrentlyValid: bool

class RawFormData(BaseModel):
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