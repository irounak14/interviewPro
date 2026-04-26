const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInterviewInvite = async ({ hrName, candidateName, candidateEmail }) => {
  const mailOptions = {
    from: `"InterviewPro" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: `Interview Invitation from ${hrName} — InterviewPro`,
    html: `
      <body style="margin:0;padding:0;background:#0f0f0f;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:40px;">
            <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;">
              Interview<span style="color:#7c3aed;">Pro</span>
            </h1>
          </div>
          <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px;">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="display:inline-block;background:rgba(124,58,237,0.15);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;">
                🎯
              </div>
            </div>
            <h2 style="color:#ffffff;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
              You've been invited!
            </h2>
            <p style="color:#71717a;text-align:center;margin:0 0 32px;font-size:14px;">
              An HR recruiter wants to connect with you
            </p>
            <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:32px;"></div>
            <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 16px;">
              Hi <strong style="color:#ffffff;">${candidateName}</strong>,
            </p>
            <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 24px;">
              <strong style="color:#ffffff;">${hrName}</strong> has reviewed your interview performance and would like to invite you for an opportunity.
            </p>
            <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:20px;margin-bottom:32px;">
              <p style="color:#a78bfa;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">
                Your Profile Impressed Them
              </p>
              <p style="color:#ffffff;font-size:14px;margin:0;">
                Your mock interview scores on InterviewPro caught their attention!
              </p>
            </div>
            <div style="text-align:center;margin-bottom:32px;">
              <a href="https://interviewpro.click/candidate/login"
                style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;">
                View Invitation →
              </a>
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.08);margin-bottom:24px;"></div>
            <p style="color:#52525b;font-size:12px;text-align:center;margin:0;">
              © 2024 InterviewPro · interviewpro.click
            </p>
          </div>
        </div>
      </body>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendInterviewInvite };