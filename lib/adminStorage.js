const KEYS = {
  contacts: "ncc_contacts",
  volunteers: "ncc_volunteers",
  donations: "ncc_donations",
  newsletter: "ncc_newsletter",
  session: "ncc_admin_session",
};

export function saveEntry(type, data) {
  if (typeof window === "undefined") return;
  const list = JSON.parse(localStorage.getItem(KEYS[type]) || "[]");
  list.unshift({
    ...data,
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(KEYS[type], JSON.stringify(list));
}

export function getEntries(type) {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEYS[type]) || "[]");
}

export function deleteEntry(type, id) {
  if (typeof window === "undefined") return;
  const list = JSON.parse(localStorage.getItem(KEYS[type]) || "[]");
  localStorage.setItem(KEYS[type], JSON.stringify(list.filter((e) => e.id !== id)));
}

export function setAdminSession() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEYS.session, "ncc_auth_v1");
}

export function checkAdminSession() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEYS.session) === "ncc_auth_v1";
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEYS.session);
}

export function getAllStats() {
  if (typeof window === "undefined") return { contacts: 0, volunteers: 0, donations: 0, newsletter: 0 };
  return {
    contacts: JSON.parse(localStorage.getItem(KEYS.contacts) || "[]").length,
    volunteers: JSON.parse(localStorage.getItem(KEYS.volunteers) || "[]").length,
    donations: JSON.parse(localStorage.getItem(KEYS.donations) || "[]").length,
    newsletter: JSON.parse(localStorage.getItem(KEYS.newsletter) || "[]").length,
  };
}

export function seedDemoData() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const day = 86400000;

  if (!localStorage.getItem(KEYS.contacts)) {
    localStorage.setItem(
      KEYS.contacts,
      JSON.stringify([
        { id: "contact_1", name: "Amina Okafor", email: "amina.okafor@gmail.com", phone: "+234 801 234 5678", reason: "Book a Screening", message: "I would like to book a free breast cancer screening for myself and my mother. We are based in Abuja. Please let me know the available dates.", createdAt: new Date(now - 1 * day).toISOString() },
        { id: "contact_2", name: "David Chen", email: "d.chen@outlook.com", phone: "", reason: "Donate/Partner", message: "Our corporate foundation is interested in partnering with your organization for CSR activities. We would like to discuss a sponsorship package.", createdAt: new Date(now - 3 * day).toISOString() },
        { id: "contact_3", name: "Fatima Al-Hassan", email: "fatima.hassan@yahoo.com", phone: "+234 703 456 7890", reason: "Patient Support", message: "My mother was recently diagnosed with cervical cancer. We are looking for support resources and would appreciate guidance on available treatment options.", createdAt: new Date(now - 5 * day).toISOString() },
        { id: "contact_4", name: "James Okonkwo", email: "jokonkwo@press.ng", phone: "+234 812 345 6789", reason: "Media & Press", message: "I am a journalist writing a feature on cancer awareness in Nigeria. I would like to interview your director and request some statistics.", createdAt: new Date(now - 7 * day).toISOString() },
        { id: "contact_5", name: "Sarah Thompson", email: "sthompson@health.co.uk", phone: "+44 7700 900123", reason: "General Enquiry", message: "I am visiting Nigeria next month and would love to volunteer at one of your community outreach events. How do I get involved?", createdAt: new Date(now - 9 * day).toISOString() },
      ])
    );
  }

  if (!localStorage.getItem(KEYS.volunteers)) {
    localStorage.setItem(
      KEYS.volunteers,
      JSON.stringify([
        { id: "vol_1", name: "Chidinma Eze", email: "chidinma.eze@gmail.com", phone: "+234 805 678 9012", location: "Enugu, Nigeria", pathway: "Community Outreach", availability: "3–5 hrs / week", skills: "Fluent in Igbo and Yoruba, community organizing experience", why: "I have personally lost two family members to late-stage cancer. I believe early detection saves lives, and I want to be part of the solution in my community.", over18: true, consent: true, createdAt: new Date(now - 2 * day).toISOString() },
        { id: "vol_2", name: "Dr. Emeka Nwosu", email: "emeka.nwosu@hospital.ng", phone: "+234 901 234 5678", location: "Lagos, Nigeria", pathway: "Healthcare Professional", availability: "Monthly drives only", skills: "Oncology nurse with 8 years experience, ACLS certified", why: "As a healthcare professional, I can provide technical expertise to improve screening protocols and train community health workers.", over18: true, consent: true, createdAt: new Date(now - 4 * day).toISOString() },
        { id: "vol_3", name: "Aisha Mohammed", email: "aisha.m@kano.edu.ng", phone: "+234 707 890 1234", location: "Kano, Nigeria", pathway: "Cancer Educator", availability: "6+ hrs / week", skills: "Secondary school biology teacher, curriculum design", why: "Cancer education must start young. I want to develop and deliver age-appropriate programs for secondary school students in Northern Nigeria.", over18: true, consent: true, createdAt: new Date(now - 6 * day).toISOString() },
        { id: "vol_4", name: "Olumide Adeyemi", email: "olu.adeyemi@techbridge.com", phone: "", location: "Lagos / Remote", pathway: "Virtual Communications", availability: "1–2 hrs / week", skills: "Social media management, graphic design, content creation", why: "My professional skills in digital marketing can help amplify your message to reach more people across Nigeria and the diaspora.", over18: true, consent: true, createdAt: new Date(now - 8 * day).toISOString() },
        { id: "vol_5", name: "Grace Obi", email: "graceobi@diaspora.co.uk", phone: "+44 7800 123456", location: "London, UK", pathway: "Fundraiser & Event Host", availability: "3–5 hrs / week", skills: "Event planning, public speaking, fundraising experience", why: "As a Nigerian in the UK diaspora, I can organize fundraising events and create bridges between the UK Nigerian community and the cancer center.", over18: true, consent: true, createdAt: new Date(now - 10 * day).toISOString() },
      ])
    );
  }

  if (!localStorage.getItem(KEYS.donations)) {
    localStorage.setItem(
      KEYS.donations,
      JSON.stringify([
        { id: "don_1", name: "Anonymous Donor", email: "anon@private.com", amount: 100000, currency: "NGN", frequency: "one-time", dedicate: false, dedicatee: "", createdAt: new Date(now - 1 * day).toISOString() },
        { id: "don_2", name: "Michael Obi", email: "m.obi@gmail.com", amount: 50, currency: "USD", frequency: "monthly", dedicate: true, dedicatee: "In memory of Mrs. Grace Obi", createdAt: new Date(now - 3 * day).toISOString() },
        { id: "don_3", name: "Blessing Achebe", email: "blessing.achebe@yahoo.com", amount: 25000, currency: "NGN", frequency: "one-time", dedicate: false, dedicatee: "", createdAt: new Date(now - 4 * day).toISOString() },
        { id: "don_4", name: "Ngozi Williams", email: "ngozi.w@hotmail.com", amount: 100, currency: "GBP", frequency: "monthly", dedicate: false, dedicatee: "", createdAt: new Date(now - 6 * day).toISOString() },
        { id: "don_5", name: "Chukwuemeka Eze", email: "c.eze@corporate.ng", amount: 500000, currency: "NGN", frequency: "one-time", dedicate: false, dedicatee: "", createdAt: new Date(now - 8 * day).toISOString() },
        { id: "don_6", name: "Dr. Amaka Nwosu", email: "amaka.nwosu@medicalfund.org", amount: 200, currency: "USD", frequency: "one-time", dedicate: true, dedicatee: "In honor of cancer survivors everywhere", createdAt: new Date(now - 10 * day).toISOString() },
      ])
    );
  }

  if (!localStorage.getItem(KEYS.newsletter)) {
    localStorage.setItem(
      KEYS.newsletter,
      JSON.stringify([
        { id: "nl_1", name: "Kemi Adebayo", email: "kemi.adebayo@gmail.com", phone: "+234 802 345 6789", message: "Please keep me updated on all your events and programs.", createdAt: new Date(now - 2 * day).toISOString() },
        { id: "nl_2", name: "Tony Ike", email: "tony.ike@yahoo.com", phone: "", message: "I want to receive your newsletter.", createdAt: new Date(now - 5 * day).toISOString() },
        { id: "nl_3", name: "Maryam Abdullahi", email: "maryam.abdullahi@outlook.com", phone: "+234 709 876 5432", message: "Interested in your upcoming events in Kano.", createdAt: new Date(now - 7 * day).toISOString() },
        { id: "nl_4", name: "Peter Okafor", email: "peter.okafor@medical.ng", phone: "+234 803 456 7890", message: "A colleague recommended your organization. Please add me to your mailing list.", createdAt: new Date(now - 11 * day).toISOString() },
        { id: "nl_5", name: "Sophia Eze", email: "sophia.eze@london.co.uk", phone: "+44 7900 234567", message: "Following your incredible work from the UK!", createdAt: new Date(now - 14 * day).toISOString() },
      ])
    );
  }
}
