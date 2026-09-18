CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creators TO anon, authenticated;
GRANT ALL ON public.creators TO service_role;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read creators" ON public.creators FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert creators" ON public.creators FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  rate NUMERIC(10,2) NOT NULL,
  rate_unit TEXT NOT NULL DEFAULT 'per project',
  description TEXT NOT NULL,
  deliverables TEXT,
  delivery_days INTEGER NOT NULL DEFAULT 7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert services" ON public.services FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  requested_date DATE NOT NULL,
  needs TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update bookings" ON public.bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.creators (id, name, tagline) VALUES
 ('11111111-1111-1111-1111-111111111101','Maya Chen','Science explainer & motion designer'),
 ('11111111-1111-1111-1111-111111111102','Daniel Okafor','Turns lectures into short-form lessons'),
 ('11111111-1111-1111-1111-111111111103','Priya Raman','Visual learning designer'),
 ('11111111-1111-1111-1111-111111111104','Lucas Ferreira','History & humanities video editor'),
 ('11111111-1111-1111-1111-111111111105','Sofia Novak','Study material & workbook designer'),
 ('11111111-1111-1111-1111-111111111106','Ahmed Hassan','Presentation designer for educators');

INSERT INTO public.services (id, creator_id, title, category, rate, rate_unit, description, deliverables, delivery_days) VALUES
 ('22222222-2222-2222-2222-222222222201','11111111-1111-1111-1111-111111111101','Turn your lecture into a polished 10-minute educational video','Educational Video',350,'per video','Send me your lecture notes, slides or a recording and I will script, edit and produce a clear, engaging video with on-screen captions, diagrams and b-roll so students stay focused from start to finish.','Fully edited MP4 in 1080p, caption file, thumbnail image and one round of revisions.',7),
 ('22222222-2222-2222-2222-222222222202','11111111-1111-1111-1111-111111111101','Animated explainer for complex science concepts','Animated Explainer',480,'per explainer','I break down difficult topics like photosynthesis, circuits or cell division into 2-3 minute animated explainers with a friendly voiceover and visual metaphors students actually remember.','2-3 minute animation, voiceover, script document and source files on request.',10),
 ('22222222-2222-2222-2222-222222222203','11111111-1111-1111-1111-111111111102','Short-form learning clips from your existing course','Short Learning Content',120,'per 5 clips','I cut your long lessons into punchy 45-90 second vertical clips for TikTok, Reels and Shorts, with hooks, captions and clean pacing built for attention spans.','5 vertical clips (9:16), captions burned in, cover frames.',4),
 ('22222222-2222-2222-2222-222222222204','11111111-1111-1111-1111-111111111103','Infographic that makes your topic instantly clear','Infographic & Visuals',150,'per infographic','Give me the key facts and I will design a clean, print- and screen-ready infographic with a strong visual hierarchy, icons and colour coding aligned to your brand or school.','High-res PNG and PDF, editable source file.',5),
 ('22222222-2222-2222-2222-222222222205','11111111-1111-1111-1111-111111111103','Diagram & visual set for a full unit','Infographic & Visuals',420,'per unit','A coordinated set of 8-12 diagrams, charts and labelled visuals covering one full teaching unit so every lesson looks consistent and professional.','8-12 visuals in PNG + SVG, style guide sheet.',12),
 ('22222222-2222-2222-2222-222222222206','11111111-1111-1111-1111-111111111104','Documentary-style history lesson video','Educational Video',400,'per video','I edit your history or social-studies material into a documentary-style video with archival imagery, maps, timelines and narration that brings the period to life.','8-15 minute MP4, chapter markers, sources list.',9),
 ('22222222-2222-2222-2222-222222222207','11111111-1111-1111-1111-111111111105','Beautiful study guide & worksheet pack','Study Material Design',180,'per pack','I turn your notes into a designed study guide with summaries, practice questions, checklists and answer keys students genuinely want to open.','Print-ready PDF (A4/Letter), editable Canva or Figma file.',6),
 ('22222222-2222-2222-2222-222222222208','11111111-1111-1111-1111-111111111105','Flashcard & revision sheet design','Study Material Design',95,'per set','Clean, well-organised flashcard decks and one-page revision sheets for any subject, optimised for printing and phone screens.','Up to 60 flashcards + revision sheet, PDF and PNG exports.',3),
 ('22222222-2222-2222-2222-222222222209','11111111-1111-1111-1111-111111111106','Redesign your lesson slides into a modern presentation','Educational Presentation',220,'per deck','Send me your existing slides and I will rebuild them with clear structure, readable typography, purposeful visuals and speaker notes so your class follows along effortlessly.','Editable PowerPoint/Google Slides deck (up to 30 slides), PDF handout.',5),
 ('22222222-2222-2222-2222-222222222210','11111111-1111-1111-1111-111111111106','Workshop presentation kit for training organisations','Educational Presentation',390,'per kit','A complete presentation kit for workshops and corporate training: master deck, activity slides, icon set and a facilitator guide.','Master deck (40+ slides), template file, facilitator PDF.',8),
 ('22222222-2222-2222-2222-222222222211','11111111-1111-1111-1111-111111111102','Whiteboard animation for math walkthroughs','Animated Explainer',260,'per animation','Step-by-step whiteboard-style animations that walk students through a math problem or proof at a pace they can follow, with narration.','3-5 minute animation, narration, worked-solution PDF.',7),
 ('22222222-2222-2222-2222-222222222212','11111111-1111-1111-1111-111111111104','30-second concept teasers for your course launch','Short Learning Content',90,'per 3 teasers','Three tight 30-second teasers that preview a lesson or course and get learners curious, ready for social media and course pages.','3 vertical + 3 square clips, captions, thumbnails.',3);

INSERT INTO public.bookings (service_id, client_name, requested_date, needs, message, status) VALUES
 ('22222222-2222-2222-2222-222222222201','Riverside High School','2026-10-05','A 10-minute video on the water cycle for Grade 8 science.','We have slides and a recorded lesson ready to share.','accepted'),
 ('22222222-2222-2222-2222-222222222204','Jordan Lee','2026-09-28','An infographic summarising the causes of World War I.','Please match our navy and gold school colours.','pending'),
 ('22222222-2222-2222-2222-222222222207','Bright Minds Tutoring','2026-09-22','Study guide pack for GCSE Biology unit 2.','Would love practice questions included.','declined'),
 ('22222222-2222-2222-2222-222222222201','Open Learning Collective','2026-10-05','A video introduction to renewable energy.','Flexible on style, aiming for a 12-minute runtime.','pending'),
 ('22222222-2222-2222-2222-222222222203','Emma Watkins','2026-10-01','Five short clips from my 40-minute algebra lesson.','Focus on solving linear equations.','pending');