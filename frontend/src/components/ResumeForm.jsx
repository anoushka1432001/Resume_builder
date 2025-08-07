import { useEffect, useState } from "react";
import axios from "axios";
import "./ResumeForm.css";
import ArrowButtons from "./ArrowKeys";
import { motion } from "framer-motion";
import { useModal } from "../contexts/ModalContext";
const baseURL = import.meta.env.VITE_API_URL;

function ResumeForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    education: [
      {
        degree: "",
        institution: "",
        gpa: "",
        gradStartMonth: "",
        gradStartYear: "",
        gradEndMonth: "",
        gradEndYear: "",
        isCurrent: false,
        courses: "",
      },
    ],
    experience: [
      {
        jobTitle: "",
        company: "",
        technologies: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isCurrent: false,
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isCurrentlyWorking: false,
        summary: "",
        description: "",
      },
    ],
    skills: [
      {
        category: "",
        items: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        obtainedMonth: "",
        obtainedYear: "",
        expiryMonth: "",
        expiryYear: "",
        isCurrentlyValid: false,
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalIndex, setModalIndex] = useState(null);
  const [modalSection, setModalSection] = useState("");

  const [showBanner, setShowBanner] = useState(false);

  const { showJsonModal, setShowJsonModal } = useModal();

  const [jsonInput, setJsonInput] = useState("");

  const [triggerSubmitAfterJson, setTriggerSubmitAfterJson] = useState(false);

  const openModal = (index, section, content) => {
    setModalIndex(index);
    setModalSection(section);
    setModalContent(content);
    setShowModal(true);
  };

  const sectionDisplayMap = {
    experience: "Experience",
    projects: "Project",
    summary: "Summary",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;

    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const handleRemoveEducation = (indexToRemove) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this education entry?"
    );
    if (!confirmDelete) return;

    const updatedEducation = formData.education.filter(
      (_, index) => index !== indexToRemove
    );
    if (updatedEducation.length > 0) {
      setFormData({ ...formData, education: updatedEducation });
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleRemoveExperience = (indexToRemove) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this experience?"
    );
    if (!confirmDelete) return;

    const updatedExperience = formData.experience.filter(
      (_, index) => index !== indexToRemove
    );
    if (updatedExperience.length > 0) {
      setFormData({ ...formData, experience: updatedExperience });
    }
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index][field] = value;

    setFormData({
      ...formData,
      projects: updatedProjects,
    });
  };

  const handleRemoveProject = (indexToRemove) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this project?"
    );
    if (!confirmDelete) return;

    const updatedProjects = formData.projects.filter(
      (_, index) => index !== indexToRemove
    );

    if (updatedProjects.length > 0) {
      setFormData({
        ...formData,
        projects: updatedProjects,
      });
    }
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  const handleRemoveSkill = (indexToRemove) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this skill category?"
    );
    if (!confirmDelete) return;

    const updatedSkills = formData.skills.filter(
      (_, index) => index !== indexToRemove
    );
    if (updatedSkills.length > 0) {
      setFormData({ ...formData, skills: updatedSkills });
    }
  };

  const handleCertificationChange = (index, field, value) => {
    const updatedCerts = [...formData.certifications];
    updatedCerts[index][field] = value;
    setFormData({ ...formData, certifications: updatedCerts });
  };

  const handleRemoveCertification = (indexToRemove) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this certification?"
    );
    if (!confirmDelete) return;

    const updatedCerts = formData.certifications.filter(
      (_, index) => index !== indexToRemove
    );
    if (updatedCerts.length > 0) {
      setFormData({ ...formData, certifications: updatedCerts });
    }
  };

  const handleSaveModal = () => {
    const updated = [...formData[modalSection]];
    const cleaned = modalContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");
    updated[modalIndex].description = cleaned;

    setFormData({
      ...formData,
      [modalSection]: updated,
    });

    setShowModal(false);
  };

  const moveSectionUp = (index, section) => {
    if (index === 0) return;
    const newSection = [...formData[section]];
    [newSection[index - 1], newSection[index]] = [
      newSection[index],
      newSection[index - 1],
    ];
    setFormData({ ...formData, [section]: newSection });
  };

  const moveSectionDown = (index, section) => {
    if (index === formData[section].length - 1) return;
    const newSection = [...formData[section]];
    [newSection[index + 1], newSection[index]] = [
      newSection[index],
      newSection[index + 1],
    ];
    setFormData({ ...formData, [section]: newSection });
  };

  const validateFormData = () => {
    if (!formData.fullName.trim()) return "Full Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone number is required";
    console.log(formData.education);
    // Check education entries
    for (let edu of formData.education) {
      if (!edu.degree.trim() || !edu.institution.trim() || !edu.gpa.trim()) {
        console.log(edu);
        return "All education fields must be filled";
      }
    }

    // Similarly for experience, projects, etc.
    for (let exp of formData.experience) {
      if (
        !exp.jobTitle.trim() ||
        !exp.company.trim() ||
        !exp.technologies.trim()
      ) {
        return "All experience fields must be filled";
      }
    }

    for (let project of formData.projects) {
      if (!project.title.trim() || !project.summary.trim()) {
        return "All project fields must be filled";
      }
    }

    for (let skill of formData.skills) {
      if (!skill.category.trim() || !skill.items.trim()) {
        return "All the fields in skills must be filled";
      }
    }

    for (let cert of formData.certifications) {
      if (!cert.name.trim() || !cert.issuer.trim()) {
        return "All certificate fields must me filled";
      }
    }

    return null;
  };

  const handleCloseBanner = () => {
    URL.revokeObjectURL(pdfBlobUrl); // free memory
    setPdfBlobUrl(null);
  };

  const getToken = () => localStorage.getItem("token");

  const saveResume = async () => {
    try {
      console.log("Saving resume with data:", formData);
      const res = await axios.post(
        `${baseURL}/save/resume`,
        { form_data: formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Resume saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
      alert("Failed to save resume.");
    }
  };

  const handleGenerateResume = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData(parsed);
      setTriggerSubmitAfterJson(true); // trigger submit once formData updates
      setShowJsonModal(false);
    } catch (err) {
      alert("Invalid JSON. Please check your input.");
      console.error("JSON parse error:", err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setPdfBlobUrl(null); // reset any old blobs

    const validationError = validateFormData();
    if (validationError) {
      alert(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/generate/resume`,
        formData, // 👈 use your current state/form handling
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (error) {
      console.error("Error generating resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: (i) => ({ opacity: 0, x: i % 2 === 0 ? -100 : 100, y: 20 }),
    visible: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${baseURL}/get/resume`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.status === 200 && res.data?.id) {
        const parsedData = res.data.form_data;
        setFormData(parsedData);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("No saved resume found for user.");
        setShowBanner(true);
      } else {
        console.error("Failed to load resume:", err);
      }
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  useEffect(() => {
    if (triggerSubmitAfterJson) {
      handleSubmit();
      setTriggerSubmitAfterJson(false);
    }
  }, [formData, triggerSubmitAfterJson]);

  return (
    <section className="resume-form">
      <motion.h2
        className="section-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Personal Information
      </motion.h2>

      {[
        {
          label: "Full Name",
          name: "fullName",
          placeholder: "e.g. John Appleseed",
        },
        { label: "Email", name: "email", placeholder: "e.g. john@email.com" },
        { label: "Phone", name: "phone", placeholder: "e.g. (123) 456-7890" },
        {
          label: "LinkedIn",
          name: "linkedin",
          placeholder: "e.g. linkedin.com/in/john",
        },
        {
          label: "Github",
          name: "github",
          placeholder: "e.g. github.com/in/john",
        },
      ].map((field, i) => (
        <motion.div
          className="form-row"
          key={field.name}
          custom={i}
          variants={sectionVariants}
          viewport={{ once: false, amount: 0.3 }}
          initial="hidden"
          animate="visible"
        >
          <label htmlFor={field.name} className="input-label">
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            id={field.name}
            className="input-field"
            value={formData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
          />
        </motion.div>
      ))}

      <h2>Summary / Objective</h2>
      <div className="form-row">
        <label className="input-label">Summary</label>
        <textarea
          className="input-field"
          rows="4"
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          placeholder="e.g. 'Aspiring full-stack developer with experience in React and Java...'"
        />
      </div>
      <small className="input-helper">
        💡 Write a short summary about yourself and your goals.
      </small>

      <h2 className="section-heading">Education</h2>

      {formData.education.map((edu, index) => (
        <div className="education-group" key={index}>
          <div className="form-header">
            <h3 className="subsection-heading">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveEducation(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-row">
            <label className="input-label">Degree</label>
            <input
              type="text"
              className="input-field"
              value={edu.degree}
              onChange={(e) =>
                handleEducationChange(index, "degree", e.target.value)
              }
              placeholder="e.g. B.Tech in Computer Science"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Institution</label>
            <input
              type="text"
              className="input-field"
              value={edu.institution}
              onChange={(e) =>
                handleEducationChange(index, "institution", e.target.value)
              }
              placeholder="e.g. University of XYZ"
            />
          </div>

          <div className="form-row">
            <label className="input-label">GPA</label>
            <input
              type="text"
              className="input-field"
              value={edu.gpa}
              onChange={(e) =>
                handleEducationChange(index, "gpa", e.target.value)
              }
              placeholder="e.g. 3.2/4.0"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Graduation Start Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={edu.gradStartMonth}
                onChange={(e) =>
                  handleEducationChange(index, "gradStartMonth", e.target.value)
                }
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={edu.gradStartYear}
                onChange={(e) =>
                  handleEducationChange(index, "gradStartYear", e.target.value)
                }
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 15 },
                  (_, i) => new Date().getFullYear() - 10 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">Graduation End Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={edu.gradEndMonth}
                onChange={(e) =>
                  handleEducationChange(index, "gradEndMonth", e.target.value)
                }
                disabled={edu.isCurrent}
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={edu.gradEndYear}
                onChange={(e) =>
                  handleEducationChange(index, "gradEndYear", e.target.value)
                }
                disabled={edu.isCurrent}
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 15 },
                  (_, i) => new Date().getFullYear() - 10 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label className="input-label small">
                <input
                  type="checkbox"
                  checked={edu.isCurrent}
                  onChange={(e) =>
                    handleEducationChange(index, "isCurrent", e.target.checked)
                  }
                />
                Currently Studying
              </label>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">Courses</label>
            <input
              type="text"
              className="input-field"
              value={edu.courses}
              onChange={(e) =>
                handleEducationChange(index, "courses", e.target.value)
              }
              placeholder="e.g. Web Development"
            />
          </div>

          <ArrowButtons
            index={index}
            section={"education"}
            formData={formData}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>
      ))}

      {/* ✅ Add this right after the .map() block above */}
      <button
        type="button"
        className="add-button"
        onClick={() => {
          setFormData({
            ...formData,
            education: [
              ...formData.education,
              {
                degree: "",
                institution: "",
                gradStartMonth: "",
                gradStartYear: "",
                gradEndMonth: "",
                gradEndYear: "",
                isCurrent: false,
                courses: "",
              },
            ],
          });
        }}
      >
        + Add Education
      </button>

      <h2 className="section-heading">Work Experience</h2>

      {formData.experience.map((exp, index) => (
        <div className="experience-group" key={index}>
          <div className="form-header">
            <h3 className="subsection-heading">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveExperience(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-row">
            <label className="input-label">Job Title</label>
            <input
              type="text"
              className="input-field"
              value={exp.jobTitle}
              onChange={(e) =>
                handleExperienceChange(index, "jobTitle", e.target.value)
              }
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Company</label>
            <input
              type="text"
              className="input-field"
              value={exp.company}
              onChange={(e) =>
                handleExperienceChange(index, "company", e.target.value)
              }
              placeholder="e.g. Infosys"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Technologies</label>
            <input
              type="text"
              className="input-field"
              value={exp.technologies}
              onChange={(e) =>
                handleExperienceChange(index, "technologies", e.target.value)
              }
              placeholder="e.g. Java, Python, SpringBoot"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Start Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={exp.startMonth}
                onChange={(e) =>
                  handleExperienceChange(index, "startMonth", e.target.value)
                }
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={exp.startYear}
                onChange={(e) =>
                  handleExperienceChange(index, "startYear", e.target.value)
                }
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">End Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={exp.endMonth}
                onChange={(e) =>
                  handleExperienceChange(index, "endMonth", e.target.value)
                }
                disabled={exp.isCurrent}
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={exp.endYear}
                onChange={(e) =>
                  handleExperienceChange(index, "endYear", e.target.value)
                }
                disabled={exp.isCurrent}
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label className="input-label small">
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={(e) =>
                    handleExperienceChange(index, "isCurrent", e.target.checked)
                  }
                />
                Currently Working
              </label>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">Description</label>
            <textarea
              className="input-field"
              rows="3"
              value={exp.description}
              onClick={() => openModal(index, "experience", exp.description)} // <- open modal here
              readOnly
              onChange={(e) =>
                handleExperienceChange(index, "description", e.target.value)
              }
              placeholder="Describe your responsibilities or achievements"
            />
          </div>
          <small className="input-helper">
            💡 Write each bullet point on a new line. (Press Enter after each
            responsibility)
          </small>

          <ArrowButtons
            index={index}
            section={"experience"}
            formData={formData}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() => {
          setFormData({
            ...formData,
            experience: [
              ...formData.experience,
              {
                jobTitle: "",
                company: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isCurrent: false,
                description: "",
              },
            ],
          });
        }}
      >
        + Add Experience
      </button>

      <h2>Projects</h2>
      {formData.projects.map((proj, index) => (
        <div className="projects-group" key={index}>
          <div className="form-header">
            <h3 className="subsection-heading">Project {index + 1}</h3>
            {formData.projects.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveProject(index)}
              >
                Remove
              </button>
            )}
          </div>
          <div className="form-row">
            <label className="input-label">Project Title</label>
            <input
              type="text"
              className="input-field"
              value={proj.title}
              onChange={(e) =>
                handleProjectChange(index, "title", e.target.value)
              }
              placeholder="e.g. Ticket Booking"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Summary</label>
            <input
              type="text"
              className="input-field"
              value={proj.summary}
              onChange={(e) =>
                handleProjectChange(index, "summary", e.target.value)
              }
              placeholder="e.g. Developed React Web App with Java Backend."
            />
          </div>

          <div className="form-row">
            <label className="input-label">Start Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={proj.startMonth}
                onChange={(e) =>
                  handleProjectChange(index, "startMonth", e.target.value)
                }
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="input-field"
                value={proj.startYear}
                onChange={(e) =>
                  handleProjectChange(index, "startYear", e.target.value)
                }
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">End Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={proj.endMonth}
                onChange={(e) =>
                  handleProjectChange(index, "endMonth", e.target.value)
                }
                disabled={proj.isCurrentlyWorking}
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                className="input-field"
                value={proj.endYear}
                onChange={(e) =>
                  handleProjectChange(index, "endYear", e.target.value)
                }
                disabled={proj.isCurrentlyWorking}
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label className="input-label small">
                <input
                  type="checkbox"
                  checked={proj.isCurrentlyWorking}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      "isCurrentlyWorking",
                      e.target.checked
                    )
                  }
                />
                Currently Working
              </label>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">Description</label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Describe your responsibilities or project details"
              value={proj.description}
              onClick={() => openModal(index, "projects", proj.description)} // <- open modal here
              readOnly
              onChange={(e) =>
                handleProjectChange(index, "description", e.target.value)
              }
            />
          </div>
          <small className="input-helper">
            💡 Write each bullet point on a new line. (Press Enter after each
            responsibility)
          </small>

          <ArrowButtons
            index={index}
            section={"projects"}
            formData={formData}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() => {
          setFormData({
            ...formData,
            projects: [
              ...formData.projects,
              {
                title: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isCurrentlyWorking: false,
                technologies: "",
                description: "",
              },
            ],
          });
        }}
      >
        + Add Project
      </button>

      <h2>Skills</h2>
      {formData.skills.map((skill, index) => (
        <div className="skills-group" key={index}>
          <div className="form-header">
            <h3 className="subsection-heading">Category {index + 1}</h3>
            {formData.skills.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveSkill(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-row">
            <label className="input-label">Category Name</label>
            <input
              type="text"
              className="input-field"
              value={skill.category}
              onChange={(e) =>
                handleSkillChange(index, "category", e.target.value)
              }
              placeholder="e.g. Frontend, Tools, Languages"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Skills</label>
            <input
              type="text"
              className="input-field"
              value={skill.items}
              onChange={(e) =>
                handleSkillChange(index, "items", e.target.value)
              }
              placeholder="e.g. React, HTML, CSS"
            />
          </div>

          <ArrowButtons
            index={index}
            section={"skills"}
            formData={formData}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() => {
          setFormData({
            ...formData,
            skills: [...formData.skills, { category: "", items: "" }],
          });
        }}
      >
        + Add Skill Category
      </button>

      <h2>Certifications</h2>
      {formData.certifications.map((cert, index) => (
        <div className="certification-group" key={index}>
          <div className="form-header">
            <h3 className="subsection-heading">Certification {index + 1}</h3>
            {formData.certifications.length > 1 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => handleRemoveCertification(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-row">
            <label className="input-label">Certificate Name</label>
            <input
              type="text"
              className="input-field"
              value={cert.name}
              onChange={(e) =>
                handleCertificationChange(index, "name", e.target.value)
              }
              placeholder="e.g. AWS Certified Developer"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Issued By</label>
            <input
              type="text"
              className="input-field"
              value={cert.issuer}
              onChange={(e) =>
                handleCertificationChange(index, "issuer", e.target.value)
              }
              placeholder="e.g. Amazon Web Services"
            />
          </div>

          <div className="form-row">
            <label className="input-label">Obtained Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={cert.obtainedMonth}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "obtainedMonth",
                    e.target.value
                  )
                }
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="input-field"
                value={cert.obtainedYear}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "obtainedYear",
                    e.target.value
                  )
                }
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="input-label">Expiry Date</label>
            <div className="date-fields">
              <select
                className="input-field"
                value={cert.expiryMonth}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "expiryMonth",
                    e.target.value
                  )
                }
                disabled={cert.isCurrentlyValid}
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="input-field"
                value={cert.expiryYear}
                onChange={(e) =>
                  handleCertificationChange(index, "expiryYear", e.target.value)
                }
                disabled={cert.isCurrentlyValid}
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 20 },
                  (_, i) => new Date().getFullYear() - 19 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <label className="input-label small">
                <input
                  type="checkbox"
                  checked={cert.isCurrentlyValid}
                  onChange={(e) =>
                    handleCertificationChange(
                      index,
                      "isCurrentlyValid",
                      e.target.checked
                    )
                  }
                />
                Currently Valid
              </label>
            </div>
          </div>

          <ArrowButtons
            index={index}
            section={"certifications"}
            formData={formData}
            moveSectionUp={moveSectionUp}
            moveSectionDown={moveSectionDown}
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={() => {
          setFormData({
            ...formData,
            certifications: [
              ...formData.certifications,
              {
                name: "",
                issuer: "",
                obtainedMonth: "",
                obtainedYear: "",
                expiryMonth: "",
                expiryYear: "",
                isCurrentlyValid: false,
              },
            ],
          });
        }}
      >
        + Add Certification
      </button>

      <div className="form-actions">
        <button className="save-button" onClick={saveResume}>
          Save
        </button>
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {loading && (
        <div className="overlay">
          <div className="loader-text">Generating resume...</div>
        </div>
      )}

      {pdfBlobUrl && (
        <div className="download-banner">
          <span>✅ Resume is ready for download</span>
          <a href={pdfBlobUrl} download="resume.pdf" className="submit-button">
            Download
          </a>
          <button className="remove-button" onClick={handleCloseBanner}>
            ×
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-expanded">
            <div className="modal-header">
              <h2>{`Describe ${
                sectionDisplayMap[modalSection] || "Section"
              }`}</h2>
            </div>

            <div className="bullet-textarea-wrapper">
              <div className="bullet-lines">
                {modalContent.split("\n").map((_, index) => (
                  <span key={index} className="bullet">
                    •
                  </span>
                ))}
              </div>
              <textarea
                className="modal-expanded-textarea bullet-overlay"
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
                placeholder="💡 Write each point on a new line..."
              />
            </div>

            <div className="modal-actions">
              <button
                className="remove-button"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you dont want to save?"
                  );
                  if (!confirmDelete) return;
                  setShowModal(false);
                }}
              >
                Exit
              </button>
              <button className="submit-button" onClick={handleSaveModal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanner && (
        <div className="banner">
          <span>
            No saved resume found. Start filling out the form and click “Save”
            to auto-load it next time.
          </span>
          <button onClick={() => setShowBanner(false)}>×</button>
        </div>
      )}

      {showJsonModal && (
        <div className={"modal-overlay"}>
          <div className="modal-expanded">
            <div className="modal-header">
              <h2>Paste JSON Form Data</h2>
            </div>

            <textarea
              className="bullet-textarea-wrapper"
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="remove-button"
                onClick={() => setShowJsonModal(false)}
              >
                Close
              </button>
              <button className="submit-button" onClick={handleGenerateResume}>
                Generate Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumeForm;
