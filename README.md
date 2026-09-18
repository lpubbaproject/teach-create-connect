# SkillSwap Connect

**Hackathon ID:** AZIS-E77VBM

Build a responsive web app called “SkillSwap” for an educational creator marketplace.

IMPORTANT:

- Do NOT add login, signup, authentication, or user accounts.

- Keep the product simple and focused on the hackathon requirements.

- The UI should closely follow the clean, modern marketplace design I will provide as reference.

- Do not add extra features such as messaging, reviews, followers, payments, escrow, calendar integrations, curriculum management, or complex analytics.

PRODUCT POSITIONING:

Headline: “Turn knowledge into content people understand.”

Supporting text: “Find creators who can transform your lessons, ideas and teaching material into engaging learning content.”

The marketplace connects educators, teachers, course creators and educational organizations with creators who can turn educational knowledge into engaging content.

MAIN NAVIGATION:

- Explore

- My Bookings

- Create Service

- Creator Dashboard

CATEGORIES:

1. Educational Video

2. Animated Explainer

3. Infographic & Visuals

4. Short Learning Content

5. Educational Presentation

6. Study Material Design

REQUIRED FEATURES:

1. EXPLORE / MARKETPLACE

- Show SkillSwap branding.

- Search bar for services.

- Category filter buttons/dropdown.

- Service cards with attractive educational thumbnails.

- Each card should show service title, creator name, category and price/rate.

- Clicking a service opens its detail page.

- Search and category filtering must actually work.

- Include realistic seeded educational services so the marketplace looks populated.

2. SERVICE DETAILS

Show:

- Service title

- Creator name

- Educational thumbnail/video-preview style area

- Description

- Category

- Price/rate

- Delivery information

- “Book This Service” button

Clicking “Book This Service” opens the booking form.

3. BOOK SERVICE

Booking form should contain:

- Client name

- Requested date

- What is needed

- Additional message

Also show the selected service and price.

Button:

- “Confirm Booking”

After confirmation:

- Create the booking.

- Show a clear booking confirmation.

- The new booking must appear in “My Bookings”.

- The creator must also see the request in “Creator Dashboard”.

4. CREATOR DASHBOARD

Show three simple sections:

- Pending Requests

- Accepted Bookings

- Declined Bookings

Pending requests have:

- Service

- Client

- Requested date

- Accept button

- Decline button

When Accept is clicked:

- Move the booking to Accepted Bookings.

- Update its status everywhere.

When Decline is clicked:

- Move it to Declined Bookings.

- Update its status everywhere.

DOUBLE-BOOKING RULE:

Multiple requests may remain Pending.

However, once a creator has accepted a booking for a conflicting date/time, another conflicting pending request cannot be accepted.

Show that conflicting request as:

“Pending • Conflict flagged”

with:

“This date conflicts with an accepted booking.”

Its Accept button must be disabled, while Decline remains available.

Keep this logic simple. Do not build a complex calendar or scheduling system.

5. MY BOOKINGS

Show the client's bookings with filters/tabs:

- All

- Pending

- Accepted

- Declined

Each booking card should clearly show:

- Service

- Creator

- Requested date

- Status

For a declined booking, show:

“Booking declined”

and a button:

“Find Similar Services”

The button should take the user back to Explore with relevant services visible.

CREATE SERVICE

Form fields:

- Service title

- Category

- Rate

- Description

- Optional “What will the client receive?” field

Button:

- “Publish Service”

Publishing must actually add the service to the marketplace so it can be browsed and booked.

DESIGN:

Use the approved SkillSwap Stitch design as the visual direction.

Style:

- Modern Gen-Z marketplace

- Professional but approachable

- Purple/blue accent direction

- Rounded cards

- Modern typography

- Attractive educational thumbnails

- Subtle gradients

- Clean spacing

- Strong visual hierarchy

- Clear buttons

- Clear status badges

- Plenty of whitespace

- Responsive on desktop and mobile

Avoid:

- Corporate-looking SaaS design

- Excessive gradients

- Excessive animations

- Tiny text

- Clutter

- Childish visuals

- Too many pages

- Too many buttons

- Complex dashboards

TECHNICAL REQUIREMENTS:

- Build the complete working frontend and backend/data logic needed for the above flows.

- Use persistent application data so creating a service and creating/updating bookings works correctly.

- Seed the app with realistic example creators, services and bookings.

- No authentication is required.

- Make the application accessible without creating an account.

- Keep the code modular and easy to maintain.

- Make all important buttons and navigation functional, not decorative.

FIRST PRIORITY:

Build the complete core SkillSwap experience described above. Do not add features outside this specification.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1e9f8b4a-bc08-4b74-824b-a2b0e6e89c7a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
