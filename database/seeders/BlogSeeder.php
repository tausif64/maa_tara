<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Number of extra placeholder "Demo Article" posts, generated only to test
     * pagination (page links with "…" gaps need 7+ pages). Set to 0 to skip them.
     */
    private const EXTRA_DEMO_POSTS = 30;

    public function run(): void
    {
        // 1. Categories
        $categories = [
            [
                'name' => 'Recovery & Healing',
                'slug' => 'recovery-and-healing',
                'description' => 'Guidance, clinical insights, and step-by-step strategies for sustainable addiction recovery.',
                'badge_color' => '#10B981',
                'sort_order' => 1,
            ],
            [
                'name' => 'Family Support',
                'slug' => 'family-support',
                'description' => 'Resources and advice for loved ones, partners, and families navigating the recovery journey.',
                'badge_color' => '#F59E0B',
                'sort_order' => 2,
            ],
            [
                'name' => 'Mental Health & Dual Diagnosis',
                'slug' => 'mental-health-dual-diagnosis',
                'description' => 'Understanding the vital connection between mental wellness, trauma, anxiety, and addiction.',
                'badge_color' => '#6366F1',
                'sort_order' => 3,
            ],
            [
                'name' => 'Mindfulness & Holistic Care',
                'slug' => 'mindfulness-holistic-care',
                'description' => 'Yoga, meditation, nutritional health, and spiritual grounding in recovery.',
                'badge_color' => '#14B8A6',
                'sort_order' => 4,
            ],
            [
                'name' => 'Success Stories',
                'slug' => 'success-stories',
                'description' => 'Real testimonials and inspiring transformation journeys from our alumni.',
                'badge_color' => '#F43F5E',
                'sort_order' => 5,
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = BlogCategory::firstOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }

        // 2. Tags
        $tags = [
            'Addiction Treatment',
            'Alcohol Recovery',
            'Detoxification',
            'Mental Wellness',
            'Family Healing',
            'Relapse Prevention',
            'CBT & Therapy',
            'Yoga & Meditation',
            'Support Groups',
            'Sobriety Milestones',
        ];

        $tagModels = [];
        foreach ($tags as $tagName) {
            $slug = Str::slug($tagName);
            $tagModels[$slug] = BlogTag::firstOrCreate(
                ['slug' => $slug],
                ['name' => $tagName]
            );
        }

        // 3. Blog Posts
        $posts = [
            [
                'title' => 'Understanding the Stages of Addiction Recovery: A Compassionate Guide',
                'slug' => 'understanding-stages-of-addiction-recovery-guide',
                'category_slug' => 'recovery-and-healing',
                'author_name' => 'Dr. Suresh Kumar Sharma',
                'excerpt' => 'Recovery is not a single event, but an evolving journey of medical healing, psychological rebuilding, and emotional renewal.',
                'content' => '<h2>The Journey of Transformation Begins with Understanding</h2><p>Addiction is widely recognized by medical professionals as a chronic, treatable medical condition that alters brain circuitry and behavioral patterns. Approaching recovery requires patience, scientific understanding, and comprehensive clinical support.</p><h3>Stage 1: Pre-Contemplation & Acknowledgment</h3><p>Before positive transformation can occur, individuals often undergo a phase of denial or ambivalence. Overcoming this hurdle involves compassionate dialogue and professional intervention rather than confrontation.</p><h3>Stage 2: Medically Supervised Detoxification</h3><p>Safe withdrawal management is paramount. Under 24/7 medical supervision at residential facilities like Maa Tara Freedom Trust, patients undergo structured detox protocols that mitigate withdrawal distress and restore vital physiological balance.</p><blockquote>"Recovery is not about stopping a substance; it is about building a life where you no longer need the escape."</blockquote><h3>Stage 3: Psychological Restructuring & CBT</h3><p>Cognitive Behavioral Therapy (CBT) and individual counseling help identify subconscious cognitive distortions, unresolved trauma, and emotional triggers. Through customized therapeutic roadmaps, patients develop resilient coping mechanisms.</p><h3>Stage 4: Long-Term Relapse Prevention & Aftercare</h3><p>Sustained sobriety thrives on continuous support. Regular alumni check-ins, routine trigger assessments, and community solidarity ensure that individuals reintegrate into professional and family life with lasting confidence.</p>',
                'featured_image' => null,
                'image_caption' => 'Comprehensive residential rehabilitation at Maa Tara Freedom Trust',
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now()->subDays(2),
                'reading_time_minutes' => 5,
                'meta_title' => 'Stages of Addiction Recovery | Maa Tara Care Guide',
                'meta_description' => 'Explore the essential phases of addiction recovery from medical detox to sustainable aftercare with clinical insights from Maa Tara Freedom Trust.',
                'meta_keywords' => 'addiction recovery stages, rehab guide, alcohol detox, de-addiction varanasi',
                'tags' => ['addiction-treatment', 'cbt-therapy', 'relapse-prevention'],
            ],
            [
                'title' => 'How Families Can Support Loved Ones in Rehabilitation Without Enabling',
                'slug' => 'how-families-can-support-loved-ones-in-rehab',
                'category_slug' => 'family-support',
                'author_name' => 'Dr. Anita Verma',
                'excerpt' => 'Discover the delicate balance between compassionate support and healthy boundaries during a loved one’s recovery process.',
                'content' => '<h2>The Crucial Role of Family in Addiction Recovery</h2><p>Addiction does not impact just one individual—it ripples across the entire household. When a family member enters rehabilitation, the entire family system has an opportunity to heal and grow together.</p><h3>Understanding Enabling vs. Empowering</h3><p>Enabling occurs when loved ones inadvertently shield an individual from the natural consequences of their addiction—such as paying debts or making excuses. Empowering, on the other hand, means offering unconditional love while maintaining firm, healthy boundaries.</p><ul><li><strong>Establish clear boundaries:</strong> Communicate consequences calmly and consistently.</li><li><strong>Participate in family therapy:</strong> Engage in structured counseling sessions led by licensed therapists.</li><li><strong>Practice self-care:</strong> Attend support groups like Al-Anon to preserve your emotional well-being.</li></ul><h3>Creating a Recovery-Friendly Home Environment</h3><p>When your loved one completes residential care, prepare a supportive atmosphere free of triggers, alcohol, and high-stress conflicts. Encourage transparent dialogue and celebrate each milestone along their sobriety journey.</p>',
                'featured_image' => null,
                'image_caption' => 'Family counseling and systemic healing session',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(5),
                'reading_time_minutes' => 4,
                'meta_title' => 'Family Support in Addiction Recovery | Maa Tara Trust',
                'meta_description' => 'Learn actionable strategies for families to support loved ones through rehab, set boundaries, and avoid enabling behaviors.',
                'meta_keywords' => 'family support rehab, addiction boundaries, family counseling varanasi',
                'tags' => ['family-healing', 'support-groups', 'addiction-treatment'],
            ],
            [
                'title' => 'The Role of Yoga, Meditation, and Holistic Nutrition in Overcoming Cravings',
                'slug' => 'role-of-yoga-meditation-holistic-nutrition-cravings',
                'category_slug' => 'mindfulness-holistic-care',
                'author_name' => 'Mr. Rajesh Tiwari',
                'excerpt' => 'Integrating daily pranayama, mindfulness meditation, and neurochemical-supportive nutrition accelerates emotional stabilization.',
                'content' => '<h2>Holistic Healing for Mind, Body, and Spirit</h2><p>Modern clinical evidence highlights the profound impact of integrative practices in rewiring the brain’s dopamine reward pathways. At Maa Tara Freedom Trust, holistic wellness is seamlessly woven into our evidence-based clinical curriculum.</p><h3>Pranayama & Nervous System Regulation</h3><p>Deep breathing techniques such as Anulom Vilom and Bhramari activate the parasympathetic nervous system, drastically lowering cortisol spikes and acute anxiety that often trigger cravings.</p><h3>Nutrition for Neurochemical Restoration</h3><p>Prolonged substance use depletes key neurotransmitters, vitamins, and gut health. A nutrient-dense diet rich in complex carbohydrates, omega-3 fatty acids, and essential amino acids accelerates serotonin and dopamine synthesis, fostering emotional balance.</p><h3>Daily Meditation as a Grounding Anchor</h3><p>Mindfulness cultivates the capacity for "urge surfing"—observing sudden cravings without acting on them impulsively. Over time, individuals gain emotional mastery over their internal responses.</p>',
                'featured_image' => null,
                'image_caption' => 'Morning yoga and meditation session at our serene campus',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(10),
                'reading_time_minutes' => 4,
                'meta_title' => 'Yoga & Nutrition in Addiction Recovery | Maa Tara',
                'meta_description' => 'Discover how mindfulness, yoga, and nutrition help regulate cravings and restore neurological balance in de-addiction recovery.',
                'meta_keywords' => 'yoga for addiction, mindfulness rehab, nutrition in recovery',
                'tags' => ['yoga-meditation', 'mental-wellness', 'relapse-prevention'],
            ],
            [
                'title' => 'Breaking the Stigma: Why Dual Diagnosis Treatment is Essential',
                'slug' => 'breaking-stigma-dual-diagnosis-treatment-essential',
                'category_slug' => 'mental-health-dual-diagnosis',
                'author_name' => 'Dr. Suresh Kumar Sharma',
                'excerpt' => 'Over 60% of people with substance use disorders also experience depression, anxiety, or PTSD. Learn why treating both simultaneously is critical.',
                'content' => '<h2>Co-occurring Disorders: When Mental Health and Addiction Meet</h2><p>For decades, mental health and addiction were treated in separate silos. However, contemporary psychiatry proves that untreated underlying mood disorders frequently drive self-medication.</p><h3>What is Dual Diagnosis?</h3><p>Dual diagnosis refers to the co-existence of a mental health condition (such as Major Depressive Disorder, Generalized Anxiety, or Bipolar Disorder) alongside a substance use disorder.</p><h3>Why Simultaneous Treatment Matters</h3><p>Treating addiction without addressing underlying anxiety or depression frequently leads to relapse. Conversely, managing mental illness without addressing chemical dependency proves ineffective. Integrated treatment protocols provide:</p><ul><li>Concurrent psychiatric evaluation and targeted pharmacotherapy.</li><li>Trauma-informed psychotherapeutic modalities.</li><li>Comprehensive relapse prevention tailored to mood triggers.</li></ul>',
                'featured_image' => null,
                'image_caption' => 'Integrated psychiatric and counseling team at Maa Tara',
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subDays(15),
                'reading_time_minutes' => 4,
                'meta_title' => 'Dual Diagnosis Treatment | Maa Tara Freedom Trust',
                'meta_description' => 'Understand how co-occurring mental health disorders and addiction are treated together for sustainable long-term recovery.',
                'meta_keywords' => 'dual diagnosis varanasi, mental health rehab, depression and addiction',
                'tags' => ['mental-wellness', 'cbt-therapy', 'addiction-treatment'],
            ],

            // ---------------------------------------------------------------
            // Additional posts (used to test pagination, filters and year list)
            // ---------------------------------------------------------------
            $this->makePost(
                title: 'What to Expect During Medical Detox: A Step-by-Step Overview',
                categorySlug: 'recovery-and-healing',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Detoxification is the first clinical step in recovery. Knowing what happens along the way can ease fear and help families prepare.',
                content: '<h2>Detox Is the Beginning, Not the Whole Journey</h2><p>Medical detoxification helps the body clear a substance safely while symptoms are monitored and managed. The experience differs for every person, depending on the substance used, how long it was used, and overall health.</p><h3>Assessment and Stabilization</h3><p>On admission, the care team reviews medical history, current medications, and vital signs. A personalized plan is created so that discomfort can be treated early and complications are caught quickly.</p><h3>Preparing for the Next Step</h3><p>Once withdrawal symptoms settle, patients move into therapy, group sessions, and skill-building programs that address the reasons behind substance use.</p>',
                tags: ['detoxification', 'addiction-treatment'],
                daysAgo: 18,
                readingTime: 5,
            ),
            $this->makePost(
                title: 'Building a Daily Routine That Protects Your Sobriety',
                categorySlug: 'recovery-and-healing',
                author: 'Mr. Rajesh Tiwari',
                excerpt: 'Structure reduces idle time, decision fatigue, and the vulnerability that so often leads to relapse.',
                content: '<h2>Why Routine Matters</h2><p>Early recovery can feel unpredictable. A steady daily rhythm gives the mind something reliable to hold on to while new habits take root.</p><h3>Anchor the Morning</h3><p>Wake at a consistent time, eat a proper breakfast, and add light movement or a few minutes of quiet reflection. A calm start sets the tone for the rest of the day.</p><h3>Plan the Risky Hours</h3><p>Notice when cravings tend to appear, often in the late afternoon or evening, and schedule a meeting, a walk, or a call with a supportive friend during those windows.</p>',
                tags: ['relapse-prevention', 'sobriety-milestones'],
                daysAgo: 21,
            ),
            $this->makePost(
                title: 'Alcohol Withdrawal: Why You Should Never Detox Alone',
                categorySlug: 'recovery-and-healing',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Withdrawal from alcohol can range from uncomfortable to dangerous. Medical supervision makes the process safer.',
                content: '<h2>Withdrawal Can Be Unpredictable</h2><p>For people who drink heavily and regularly, stopping suddenly can trigger serious symptoms such as severe anxiety, tremors, seizures, or confusion. In some cases withdrawal can become a medical emergency.</p><h3>The Case for Supervised Care</h3><p>In a supervised setting, doctors can monitor symptoms around the clock, provide appropriate medication, and respond quickly if something changes. If you or someone you love is dependent on alcohol, speak with a medical professional before attempting to stop.</p>',
                tags: ['alcohol-recovery', 'detoxification'],
                daysAgo: 24,
            ),
            $this->makePost(
                title: 'Setting Realistic Goals in the First 90 Days of Recovery',
                categorySlug: 'recovery-and-healing',
                author: 'Dr. Anita Verma',
                excerpt: 'Small, achievable goals build confidence and momentum during the most vulnerable months of recovery.',
                content: '<h2>Start Small, Stay Consistent</h2><p>The first three months bring big emotional swings. Trying to fix everything at once often leads to discouragement, so focus on a few goals that can be achieved one day at a time.</p><h3>Examples of Helpful Goals</h3><ul><li>Attend every scheduled counseling session.</li><li>Sleep and wake at regular times.</li><li>Reach out to one supportive person each day.</li></ul><p>Each completed goal is proof that change is possible.</p>',
                tags: ['sobriety-milestones', 'relapse-prevention'],
                daysAgo: 28,
            ),
            $this->makePost(
                title: 'Talking to a Loved One About Addiction: Where to Begin',
                categorySlug: 'family-support',
                author: 'Dr. Anita Verma',
                excerpt: 'A calm, caring conversation can open the door to treatment. Here is how to prepare for it.',
                content: '<h2>Choose the Right Moment</h2><p>Pick a quiet time when the person is sober and neither of you is rushed or angry. Privacy helps people feel respected rather than cornered.</p><h3>Speak From Concern, Not Blame</h3><p>Describe what you have noticed and how it affects you, using statements such as "I am worried about you." Avoid labels and accusations, which tend to trigger defensiveness.</p><h3>Offer a Next Step</h3><p>Have information ready about counseling or treatment options so that the conversation ends with a concrete way forward.</p>',
                tags: ['family-healing', 'addiction-treatment'],
                daysAgo: 32,
            ),
            $this->makePost(
                title: 'Supporting Children When a Parent Is in Recovery',
                categorySlug: 'family-support',
                author: 'Ms. Neha Pandey',
                excerpt: 'Children notice more than we think. Honest, age-appropriate conversations help them feel safe and understood.',
                content: '<h2>Children Need Honest, Simple Answers</h2><p>Kids often sense that something is wrong long before they are told. Explaining, in words suited to their age, that addiction is an illness and that it is not their fault can lift a heavy emotional burden.</p><h3>Keep Routines Steady</h3><p>Predictable mealtimes, school schedules, and bedtime rituals give children stability while the household adjusts. Encourage them to share feelings, and consider family counseling if they are struggling.</p>',
                tags: ['family-healing', 'mental-wellness'],
                daysAgo: 36,
            ),
            $this->makePost(
                title: 'Rebuilding Trust After Addiction: A Guide for Couples',
                categorySlug: 'family-support',
                author: 'Dr. Anita Verma',
                excerpt: 'Trust returns slowly, through consistent actions and open communication rather than promises.',
                content: '<h2>Trust Is Rebuilt in Small Moments</h2><p>Addiction often leaves behind broken promises and hurt. Rebuilding trust requires reliability over time, meaning that words and actions match again and again.</p><h3>Practical Steps</h3><ul><li>Schedule regular, calm check-ins about feelings and progress.</li><li>Agree on clear boundaries together.</li><li>Consider couples counseling with a trained therapist.</li></ul><p>Patience on both sides is essential. Healing is a shared process.</p>',
                tags: ['family-healing', 'cbt-therapy'],
                daysAgo: 41,
            ),
            $this->makePost(
                title: 'Anxiety and Substance Use: Breaking the Self-Medication Cycle',
                categorySlug: 'mental-health-dual-diagnosis',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Many people use substances to quiet anxious thoughts, but the relief is temporary and often makes anxiety worse.',
                content: '<h2>When Relief Becomes the Problem</h2><p>Alcohol and other substances can dull anxiety for a short time. As the effect fades, anxiety often returns stronger, which encourages more use and creates a difficult cycle.</p><h3>Healthier Ways to Cope</h3><p>Therapy, breathing exercises, regular physical activity, and, where appropriate, medication prescribed by a psychiatrist can all reduce anxiety without the harm of substance use. Treating both conditions together gives the best chance of lasting change.</p>',
                tags: ['mental-wellness', 'cbt-therapy'],
                daysAgo: 46,
            ),
            $this->makePost(
                title: 'Understanding the Link Between Trauma and Addiction',
                categorySlug: 'mental-health-dual-diagnosis',
                author: 'Ms. Neha Pandey',
                excerpt: 'Painful past experiences can shape how a person copes with stress. Trauma-informed care addresses the root, not only the symptom.',
                content: '<h2>Behind Many Addictions Is Unresolved Pain</h2><p>Some people turn to substances to numb memories, fear, or grief. Recognizing this connection replaces judgment with understanding.</p><h3>What Trauma-Informed Care Looks Like</h3><p>It means creating a safe, respectful environment, letting patients move at their own pace, and using therapies designed to process difficult experiences safely alongside addiction treatment.</p>',
                tags: ['mental-wellness', 'addiction-treatment'],
                daysAgo: 52,
            ),
            $this->makePost(
                title: 'Sleep, Mood, and Recovery: Why Rest Matters',
                categorySlug: 'mental-health-dual-diagnosis',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Poor sleep is common in early recovery and can intensify cravings and low mood. Simple habits can help.',
                content: '<h2>Sleep Supports Emotional Balance</h2><p>Disturbed sleep is common after stopping substance use. Because tiredness lowers patience and self-control, it can make cravings harder to manage.</p><h3>Healthy Sleep Habits</h3><ul><li>Keep a regular sleep and wake time.</li><li>Limit screens and caffeine in the evening.</li><li>Create a quiet, cool, dark bedroom.</li></ul><p>If sleep problems continue for weeks, talk with your care team.</p>',
                tags: ['mental-wellness', 'relapse-prevention'],
                daysAgo: 58,
            ),
            $this->makePost(
                title: 'Urge Surfing for Beginners: Riding Out a Craving',
                categorySlug: 'mindfulness-holistic-care',
                author: 'Mr. Rajesh Tiwari',
                excerpt: 'A craving rises, peaks, and passes. Learning to observe it without acting is a powerful recovery skill.',
                content: '<h2>Cravings Are Waves</h2><p>An urge can feel endless, yet most cravings build, peak, and fade within a short time. Urge surfing teaches you to watch that wave with curiosity instead of fighting it or giving in.</p><h3>How to Practice</h3><p>Sit comfortably, breathe slowly, and notice where you feel the craving in your body. Describe the sensation silently and keep breathing until it eases. With practice, each wave feels less powerful.</p>',
                tags: ['yoga-meditation', 'relapse-prevention'],
                daysAgo: 64,
            ),
            $this->makePost(
                title: 'Eating Well in Early Recovery: Simple Nutrition Basics',
                categorySlug: 'mindfulness-holistic-care',
                author: 'Mr. Rajesh Tiwari',
                excerpt: 'Regular, balanced meals help the body heal and steady mood and energy during recovery.',
                content: '<h2>Food as Part of Healing</h2><p>Substance use often disrupts appetite and nutrition. Eating regular meals with vegetables, whole grains, protein, and plenty of water helps restore energy and supports stable mood.</p><h3>Easy Habits to Start With</h3><ul><li>Do not skip breakfast.</li><li>Keep healthy snacks such as fruit and nuts within reach.</li><li>Limit excess sugar and caffeine, which can worsen restlessness.</li></ul>',
                tags: ['mental-wellness', 'detoxification'],
                daysAgo: 71,
            ),
            $this->makePost(
                title: 'Five-Minute Breathing Practices for Stressful Moments',
                categorySlug: 'mindfulness-holistic-care',
                author: 'Mr. Rajesh Tiwari',
                excerpt: 'Short breathing exercises calm the nervous system and can be done anywhere, at any time.',
                content: '<h2>Your Breath Is Always With You</h2><p>Slow, steady breathing signals the body to relax. It is a simple tool to use when stress, anger, or cravings rise suddenly.</p><h3>A Simple Practice</h3><p>Inhale gently through the nose for a count of four, then exhale slowly for a count of six. Repeat for five minutes, letting your shoulders soften with each breath. Practicing daily makes the skill easier to use in difficult moments.</p>',
                tags: ['yoga-meditation', 'mental-wellness'],
                daysAgo: 79,
                readingTime: 3,
            ),
            $this->makePost(
                title: 'From Rock Bottom to Rebuilding: Ravi’s Story',
                categorySlug: 'success-stories',
                author: 'Care Team',
                excerpt: 'A composite story of hitting bottom, asking for help, and rebuilding a life one day at a time.',
                content: '<h2>A Turning Point</h2><p><em>This story is a composite illustration. Names and details have been changed.</em></p><p>Ravi had lost his job and strained nearly every relationship when he finally agreed to enter treatment. The first weeks were hard, but steady counseling, group sessions, and his family’s support helped him see a way forward.</p><p>Today he has completed his program, returned to work, and speaks openly about recovery. His advice to others: ask for help early, and keep taking the next small step.</p>',
                tags: ['sobriety-milestones', 'alcohol-recovery'],
                daysAgo: 88,
            ),
            $this->makePost(
                title: 'A Mother’s Comeback: Sunita’s One-Year Milestone',
                categorySlug: 'success-stories',
                author: 'Care Team',
                excerpt: 'A composite story of a mother reclaiming her health, her home, and her children’s trust.',
                content: '<h2>One Year, One Day at a Time</h2><p><em>This story is a composite illustration. Names and details have been changed.</em></p><p>Sunita entered treatment worried that she had failed her children. Through therapy and family sessions she learned to forgive herself and to rebuild trust gradually.</p><p>After a year of sobriety she describes ordinary moments, such as cooking dinner and helping with homework, as the greatest gifts of recovery.</p>',
                tags: ['sobriety-milestones', 'family-healing'],
                daysAgo: 97,
            ),
            $this->makePost(
                title: 'Finding Purpose Through Service: Anil’s Journey',
                categorySlug: 'success-stories',
                author: 'Care Team',
                excerpt: 'A composite story of a man who turned his recovery into a way of helping others.',
                content: '<h2>Giving Back</h2><p><em>This story is a composite illustration. Names and details have been changed.</em></p><p>After completing treatment, Anil began attending a weekly support group. Over time he started welcoming newcomers and sharing his experience.</p><p>Helping others gave him a sense of purpose that supports his own sobriety. He often says that service keeps him grounded and grateful.</p>',
                tags: ['support-groups', 'sobriety-milestones'],
                daysAgo: 110,
            ),
            $this->makePost(
                title: 'How Support Groups Strengthen Long-Term Recovery',
                categorySlug: 'recovery-and-healing',
                author: 'Ms. Neha Pandey',
                excerpt: 'Sharing experiences with people who understand reduces isolation and builds lasting accountability.',
                content: '<h2>You Are Not Alone</h2><p>Shame and loneliness are powerful relapse triggers. Support groups offer a place to speak honestly without judgment and to learn from others further along the path.</p><h3>What Groups Provide</h3><ul><li>Accountability and encouragement.</li><li>Practical coping strategies shared by peers.</li><li>A sense of belonging that lasts beyond formal treatment.</li></ul>',
                tags: ['support-groups', 'relapse-prevention'],
                daysAgo: 125,
            ),
            $this->makePost(
                title: 'Recognizing the Early Warning Signs of Relapse',
                categorySlug: 'recovery-and-healing',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Relapse is a process, not a single moment. Spotting early signs allows you to act before it escalates.',
                content: '<h2>Relapse Starts Before the First Drink or Dose</h2><p>Changes in thinking and behavior often appear well before actual use. Common signs include skipping meetings, isolating from supportive people, romanticizing past use, and neglecting sleep or meals.</p><h3>What to Do</h3><p>Talk to your counselor or sponsor as soon as you notice these signs. Reviewing your relapse prevention plan and reconnecting with support can restore balance quickly.</p>',
                tags: ['relapse-prevention', 'cbt-therapy'],
                daysAgo: 140,
            ),
            $this->makePost(
                title: 'CBT in Recovery: Changing the Thoughts That Drive Cravings',
                categorySlug: 'mental-health-dual-diagnosis',
                author: 'Dr. Anita Verma',
                excerpt: 'Cognitive Behavioral Therapy helps people notice unhelpful thoughts and replace them with healthier responses.',
                content: '<h2>Thoughts, Feelings, and Actions Are Connected</h2><p>CBT is built on the idea that our thoughts influence our emotions and behavior. Thoughts such as "I cannot cope without it" can quickly lead to cravings and use.</p><h3>Learning New Responses</h3><p>With a therapist, patients learn to identify these thoughts, question them, and practice healthier alternatives. Over time, this weakens the automatic link between stress and substance use.</p>',
                tags: ['cbt-therapy', 'mental-wellness'],
                daysAgo: 160,
            ),
            $this->makePost(
                title: 'Self-Care for Caregivers: You Cannot Pour From an Empty Cup',
                categorySlug: 'family-support',
                author: 'Dr. Anita Verma',
                excerpt: 'Supporting someone in recovery is demanding. Looking after your own health helps you support them better.',
                content: '<h2>Caregivers Need Care Too</h2><p>Family members often carry stress, worry, and exhaustion in silence. Ignoring your own needs can lead to burnout and resentment.</p><h3>Small Steps for Yourself</h3><ul><li>Keep regular meals, sleep, and time outdoors.</li><li>Join a family support group.</li><li>Set boundaries and accept help from others.</li></ul><p>Taking care of yourself is not selfish. It makes lasting support possible.</p>',
                tags: ['family-healing', 'support-groups'],
                daysAgo: 200,
            ),
            $this->makePost(
                title: 'Celebrating Sobriety Milestones: Why Every Day Counts',
                categorySlug: 'recovery-and-healing',
                author: 'Mr. Rajesh Tiwari',
                excerpt: 'From the first week to the first year, marking progress builds confidence and reinforces commitment.',
                content: '<h2>Progress Deserves Recognition</h2><p>Each milestone, whether one week, one month, or one year, represents real effort and courage. Acknowledging it strengthens motivation for the road ahead.</p><h3>Ways to Celebrate</h3><p>Share the achievement with someone who supports you, write down what you have learned, or treat yourself to a healthy activity you enjoy. Celebrations do not need to be large to be meaningful.</p>',
                tags: ['sobriety-milestones'],
                daysAgo: 250,
                readingTime: 3,
            ),
            $this->makePost(
                title: 'Choosing a Rehabilitation Centre: Questions Every Family Should Ask',
                categorySlug: 'recovery-and-healing',
                author: 'Dr. Suresh Kumar Sharma',
                excerpt: 'Finding the right facility is an important decision. These questions help families compare options with confidence.',
                content: '<h2>Look Beyond the Brochure</h2><p>A good rehabilitation centre is defined by the quality of its care, not by its facilities alone. Take time to visit, ask questions, and trust your instincts.</p><h3>Questions to Ask</h3><ul><li>Is there 24/7 medical supervision and a qualified clinical team?</li><li>Is treatment individualized, and does it include therapy and family involvement?</li><li>What aftercare and relapse prevention support is offered?</li></ul>',
                tags: ['addiction-treatment', 'family-healing'],
                daysAgo: 380,
                readingTime: 5,
            ),
        ];

        // Placeholder posts used only to test pagination with many pages.
        $categorySlugs = array_keys($categoryModels);
        $tagSlugs = array_keys($tagModels);

        for ($i = 1; $i <= self::EXTRA_DEMO_POSTS; $i++) {
            $posts[] = $this->makePost(
                title: "Demo Article {$i}: Notes on Recovery",
                categorySlug: $categorySlugs[$i % count($categorySlugs)],
                author: 'Care Team',
                excerpt: 'Placeholder article used to test pagination and filters. Safe to delete before launch.',
                content: '<h2>Placeholder content</h2><p>This demo article exists only to test pagination. Remove it before going live.</p>',
                tags: [$tagSlugs[$i % count($tagSlugs)], $tagSlugs[($i + 3) % count($tagSlugs)]],
                daysAgo: 430 + ($i * 4),
                readingTime: 2,
            );
        }

        foreach ($posts as $postData) {
            $tagSlugsForPost = $postData['tags'];
            $catSlug = $postData['category_slug'];
            unset($postData['tags'], $postData['category_slug']);

            $postData['category_id'] = $categoryModels[$catSlug]->id ?? null;

            $post = BlogPost::firstOrCreate(
                ['slug' => $postData['slug']],
                $postData
            );

            $syncTagIds = [];
            foreach ($tagSlugsForPost as $tSlug) {
                if (isset($tagModels[$tSlug])) {
                    $syncTagIds[] = $tagModels[$tSlug]->id;
                }
            }
            $post->tags()->sync($syncTagIds);
        }
    }

    /**
     * Build a published post array in the same shape as the hand-written ones above.
     */
    private function makePost(
        string $title,
        string $categorySlug,
        string $author,
        string $excerpt,
        string $content,
        array $tags,
        int $daysAgo,
        int $readingTime = 4,
    ): array {
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'category_slug' => $categorySlug,
            'author_name' => $author,
            'excerpt' => $excerpt,
            'content' => $content,
            'featured_image' => null,
            'image_caption' => 'Maa Tara Freedom Trust',
            'status' => 'published',
            'is_featured' => false,
            'published_at' => now()->subDays($daysAgo),
            'reading_time_minutes' => $readingTime,
            'meta_title' => Str::limit($title, 45, '') . ' | Maa Tara',
            'meta_description' => Str::limit($excerpt, 155),
            'meta_keywords' => str_replace('-', ' ', implode(', ', $tags)),
            'tags' => $tags,
        ];
    }
}