from rag.systemRag import retrieve_resume_context


resume = """
Rameesa Sumair
MERN Stack Web Developer

Skills:
React.js, Node.js, Express.js, MongoDB, JavaScript, REST APIs, Git, GitHub.

Experience:
Developed responsive web applications using React and Node.js.
Built REST APIs with Express.js and MongoDB.
Implemented authentication and CRUD functionality.

Projects:
Hospital Management System
Task Tracker System
Music Streaming Application
"""

job_description = """
We are looking for a Full Stack Developer with experience in
React, Node.js, MongoDB, REST APIs, TypeScript, Docker and AWS.
The candidate should be able to build scalable web applications
and develop secure backend APIs.
"""


context = retrieve_resume_context(
    resume,
    job_description
)

print("\n===== RETRIEVED RESUME CONTEXT =====\n")
print(context)