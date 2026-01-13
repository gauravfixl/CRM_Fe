// src/data/offerLetterTemplates.ts
const offerLetterTemplates = {
  general: `
<h2 style="text-align:center;">General Offer Letter</h2>

<p><strong>Subject:</strong> Offer Letter for the position of [Position Name]</p>

<p>Dear <strong>[Candidate Name]</strong>,</p>

<p>We are pleased to inform you that we have decided to extend an offer for the position of <strong>[Position Name]</strong> in our esteemed organization. Your dedication, hard work, and potential have impressed us, and we believe you will be the perfect fit for our team.</p>

<p>In this role, you will be responsible for <strong>[Job Responsibilities]</strong>, and we trust that you can fulfill these duties with diligence and professionalism. Your reporting manager, <strong>[Manager’s Name]</strong>, will be your guide and mentor throughout your journey with us.</p>

<p>We acknowledge that you will join us on <strong>[Joining Date]</strong>, and we are excited to have you on board. If you are willing to accept this offer, please reply to this mail with your signature.</p>

<p>If you have any doubts, feel free to reach out to us. We look forward to your positive response!</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Job Title]<br/>
[Email Signature]</p>
`,

  fulltime: `
<h2 style="text-align:center;">Full-Time Offer Letter</h2>

<p><strong>Subject:</strong> [Job Position] at [Company’s Name]</p>

<p>Dear <strong>[Candidate’s Name]</strong>,</p>

<p>We are delighted to offer you the <strong>[Job Title]</strong> position with <strong>[Company Name]</strong>. We are impressed with your skills, experience, and qualifications, and we are confident that you will be an asset to our team.</p>

<p>Your starting date will be <strong>[Date]</strong>, and your salary will be <strong>[Annual Salary]</strong>, along with additional benefits like <strong>[Other Benefits]</strong>. Further details on this will be shared during your onboarding process.</p>

<p>Your initial duties will include <strong>[Responsibilities]</strong>. As a part of our team, we expect you to work diligently, communicate effectively, and collaborate with your teammates to achieve our shared goals.</p>

<p>Please indicate your acceptance by replying to this email. We would appreciate a response by <strong>[Deadline]</strong> so we can start the onboarding process.</p>

<p>We welcome you to our team!</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,

  government: `
<h2 style="text-align:center;">Government Offer Letter</h2>

<p><strong>Subject:</strong> Joining Letter at [Ministry Name]</p>

<p>Dear <strong>[Candidate’s Name]</strong>,</p>

<p>We are pleased to inform you that you have been appointed as <strong>[Job Position]</strong> in the <strong>[Department]</strong> of the government of <strong>[Country/State]</strong>. Your role will commence from <strong>[Start Date]</strong>, and you will report to <strong>[Reporting Authority]</strong>.</p>

<p>Your monthly salary will be <strong>[Salary Amount]</strong>, and you will be entitled to other benefits as per government policies. You are requested to work from Monday to Friday and may have to work on weekends in case of emergencies.</p>

<p>As a government employee, you are expected to adhere strictly to the rules and regulations of the government.</p>

<p>Please be present on the joining date with the necessary documents and undergo a security clearance process.</p>

<p>We welcome you to our department and look forward to having you on the <strong>[Department]</strong> team.</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Ministry Name]<br/>
[State/Country]</p>
`,

  freelancer: `
<h2 style="text-align:center;">Freelancer Offer Letter</h2>

<p><strong>Subject:</strong> Freelancer at [Company Name]</p>

<p>Dear <strong>[Freelancer Name]</strong>,</p>

<p>We are excited to extend a freelance offer to you for the position of <strong>[Job Position]</strong> in our <strong>[Department]</strong>. After reviewing your impressive portfolio, we believe you will be an excellent fit for our team.</p>

<p>As a freelancer, you will be responsible for <strong>[Briefly mention the primary duties and responsibilities]</strong>. You will play a crucial role in our success, and we trust you will deliver consistent, high-quality work.</p>

<p>Your hourly rate will be <strong>[Amount]</strong>. Please note that this is a freelance position, and you will not be considered an employee of our company; hence, you will be responsible for your taxes and related expenses.</p>

<p>We will provide <strong>[Any software, equipment, or other resources]</strong> and grant access to our communication channels to stay updated on projects and deadlines.</p>

<p>Please confirm your acceptance by replying to this mail with your signature before <strong>[Deadline]</strong>. Feel free to reach out if you have any questions.</p>

<p>We are thrilled to have you on board.</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,

  internship: `
<h2 style="text-align:center;">Internship Offer Letter</h2>

<p><strong>Subject:</strong> Internship Opportunity at [Company Name]</p>

<p>Dear <strong>[Intern’s Name]</strong>,</p>

<p>We are pleased to offer you an internship position as <strong>[Internship Role]</strong> in our <strong>[Department]</strong> at <strong>[Company Name]</strong>. We were impressed by your enthusiasm and potential during the selection process.</p>

<p>Your internship will commence on <strong>[Start Date]</strong> and continue until <strong>[End Date]</strong>. During this period, you will report to <strong>[Supervisor’s Name]</strong> and be involved in <strong>[Brief responsibilities]</strong>.</p>

<p>You will receive a stipend of <strong>[Amount]</strong> per month, and the working days will be from <strong>[Days of the week]</strong>. You are expected to maintain professionalism and follow the company’s policies during your internship.</p>

<p>Please confirm your acceptance by replying to this email before <strong>[Deadline]</strong>.</p>

<p>We look forward to having you as part of our team!</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,

  internal: `
<h2 style="text-align:center;">Internal Offer Letter</h2>

<p><strong>Subject:</strong> Internal Role Offer for [Job Position]</p>

<p>Dear <strong>[Candidate’s Name]</strong>,</p>

<p>We are elated to welcome you as our new <strong>[Job Position]</strong> in the <strong>[Department]</strong>. This opportunity is a result of your hard work and dedication to the company’s growth. Congratulations on this accomplishment!</p>

<p>As a valued team member, we are offering you this role internally. We are confident that you will excel in this position and continue contributing to the success of our organization.</p>

<p>In this new role, you will take on responsibilities such as <strong>[New Roles and Responsibilities]</strong> and report directly to <strong>[Reporting Manager]</strong>.</p>

<p>Please confirm your acceptance by replying to this mail before <strong>[Deadline]</strong>. Feel free to reach out if you have any questions regarding this role.</p>

<p>We are excited to see you excel in your new position!</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,

  remote: `
<h2 style="text-align:center;">Remote Employee Offer Letter</h2>

<p><strong>Subject:</strong> [Job Title] Position at [Company Name]</p>

<p>Dear <strong>[Candidate’s Name]</strong>,</p>

<p>We welcome you to join our team as a remote <strong>[Job Title]</strong>. Your skills and experience will make you a valuable addition to our company, and we are thrilled to have you on board.</p>

<p>As a remote employee, you will have the flexibility to work from anywhere worldwide. You will be provided with <strong>[Tools, resources, software]</strong> to assist you in your work, and we will work together to ensure a smooth onboarding experience.</p>

<p>We understand remote work can present unique challenges, but our team is committed to creating an environment of communication and transparency.</p>

<p>We hope that you accept the offer and reply to this mail by <strong>[Date]</strong>. If you have any concerns, feel free to contact us.</p>

<p>We look forward to working with you.</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,

  international: `
<h2 style="text-align:center;">International Offer Letter</h2>

<p><strong>Subject:</strong> Exciting International Job Offer at [Company Name]</p>

<p>Dear <strong>[Candidate’s Name]</strong>,</p>

<p>We are thrilled to offer you the position of <strong>[Job Title]</strong> at our <strong>[Location]</strong>. We are a fast-growing organization with a global presence, and we are impressed with your experience and skills.</p>

<p>As our <strong>[Job Title]</strong>, you will be responsible for <strong>[Responsibilities]</strong> and will have the opportunity to collaborate with top professionals in the industry.</p>

<p>We offer a competitive compensation package that includes <strong>[Details of Compensation Package]</strong>. Our organization is committed to upholding values of <strong>[Company Values]</strong>, and we believe your dedication will contribute to our success.</p>

<p>If you are willing to accept this offer, please reply to this mail with a signed copy of the offer letter before <strong>[Date]</strong>. We will arrange a call to discuss any questions you may have.</p>

<p>We are excited to have you on board and look forward to hearing from you soon!</p>

<p>Best Regards,</p>
<p><strong>[Your Name]</strong><br/>
[Your Job Title]<br/>
[Email Signature]</p>
`,
};

export default offerLetterTemplates;
