/*
 * JavaScript for Website Interactivity
 *
 * This section handles smooth scrolling for navigation links
 * and the generation of the "Contact City Council" email.
 */

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor jump

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
          // Calculate offset to account for sticky header
          const headerOffset = document.querySelector('header').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth' // Smooth scroll effect
          });

          // Update active class for navigation links
          document.querySelectorAll('nav ul li a').forEach(link => {
              link.classList.remove('active');
          });
          this.classList.add('active');
      }
  });
});

// Highlight active navigation link based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]'); // Select all sections with an ID
  const navLinks = document.querySelectorAll('nav ul li a');
  const headerHeight = document.querySelector('header').offsetHeight; // Get height of sticky header
  let currentActiveSection = '';

  // Determine which section is currently in view
  sections.forEach(section => {
      // Adjust sectionTop by headerHeight to correctly detect when section is "active"
      const sectionTop = section.offsetTop - headerHeight - 1; // -1 for slight buffer
      const sectionBottom = sectionTop + section.offsetHeight;

      if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
          currentActiveSection = section.getAttribute('id');
      }
  });

  // Apply 'active' class to the corresponding navigation link
  navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(currentActiveSection)) {
          link.classList.add('active');
      }
  });
});

// Function to generate email to City Council
function generateCouncilEmail() {
  const userName = document.getElementById('userName').value;
  const userEmail = document.getElementById('userEmail').value;
  const userMessage = document.getElementById('userMessage').value;
  const emailLinkDiv = document.getElementById('generatedEmailLink');
  const emailLink = document.getElementById('emailLink');

  // Basic validation
  if (!userName || !userEmail) {
      // Using a simple message box for user feedback
      const messageBox = document.createElement('div');
      messageBox.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;
          padding: 20px; border-radius: 8px; z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2); text-align: center;
          max-width: 90%; /* Responsive width */
      `;
      messageBox.innerHTML = `
          <p>Please enter your Name and Email to generate the message.</p>
          <button onclick="this.parentNode.remove()" style="margin-top: 15px; padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>
      `;
      document.body.appendChild(messageBox);
      return;
  }

  // City Council email addresses (from previous search results)
  const councilEmails = [
      'council@berkeleyca.gov', // General council email
      'mayor@berkeleyca.gov', // Mayor's email
      'rkesarwani@berkeleyca.gov', // District 1
      'ttaplin@berkeleyca.gov',    // District 2
      'bbartlett@berkeleyca.gov',  // District 3
      'itregub@berkeleyca.gov',    // District 4
      'sokeefe@berkeleyca.gov',    // District 5
      'bblackaby@berkeleyca.gov',  // District 6
      'clunaparra@berkeleyca.gov', // District 7
      'mhumbert@berkeleyca.gov'    // District 8
  ];

  const subject = encodeURIComponent("Support for More Dog Parks in Berkeley");
  let body = `Dear Berkeley City Council Members,\n\n`;
  body += `I am writing to express my strong support for the creation of additional designated dog parks in Berkeley. As a resident and a member of the community, I believe that more dog parks will bring significant benefits to our city.\n\n`;
  body += `Dog parks promote responsible pet ownership by providing safe, legal spaces for off-leash exercise, which is crucial for canine health and socialization. They also foster community connections among residents and contribute to a safer, more harmonious urban environment by reducing unauthorized off-leash activity in other public spaces.\n\n`;
  body += `I urge you to prioritize the allocation of resources and identify suitable locations for new dog parks across Berkeley.\n\n`;

  if (userMessage.trim() !== '') {
      body += `\nMy personal thoughts on this matter are:\n"${userMessage.trim()}"\n\n`;
  }

  body += `Thank you for your time and consideration of this important community need.\n\n`;
  body += `Sincerely,\n${userName}\n${userEmail}\nBerkeley Resident`;

  const mailtoLink = `mailto:${councilEmails.join(',')}` +
                     `?subject=${subject}` +
                     `&body=${encodeURIComponent(body)}`;

  emailLink.href = mailtoLink;
  emailLinkDiv.style.display = 'block'; // Show the generated link