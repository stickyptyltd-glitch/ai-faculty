# Pathway graphics

Generated on 2026-11-13 using the built-in image_gen tool and the imagegen skill.
The exact generation prompts are preserved in [prompts.json](prompts.json)
and [prompts-batch-2.json](prompts-batch-2.json), with individual technical pathways
in [prompts-batch-3.json](prompts-batch-3.json) and
[prompts-batch-4.json](prompts-batch-4.json). Creative pathway prompts are in
[prompts-batch-5.json](prompts-batch-5.json), and life-skills prompts are in
[prompts-batch-6.json](prompts-batch-6.json).

| Asset | Use |
| --- | --- |
| pathways-overview | Pathway catalogue overview: a book connects work, technical and creative learning |
| pathways-work | Using AI at work section: a desk with a task workflow |
| pathways-build | Building AI section: a modular computational workbench |
| pathways-personal | AI outside work: a home, notebook and information-checking tools |
| pathways-life | Life skills: cooking, gardening and home-project tools |
| pathways-creative | Creative subjects: an easel, camera, brushes and music keyboard |
| pathway-software-engineering | Computer Engineering — Software: coding, branching and testing |
| pathway-android-development | Android App Development: mobile screens and navigation |
| pathway-data-science | Data Science: charts, data stores and inspection |
| pathway-cybersecurity | Cybersecurity: a shield, servers and inspection tools |
| pathway-engineering | AI Engineering: sources, tools and evaluation |
| pathway-foundations | Technical Foundations: tokens, model layers and connected nodes |
| pathway-ml | Machine Learning: samples, model building and evaluation |
| pathway-agents | Agentic Systems: a bounded workflow with a pause gate |
| pathway-safety | AI Safety: test cases, inspection and a release gate |
| pathway-graphic-design | Graphic Design: layout, colour swatches and drawing tools |
| pathway-music-production | Music Production: recording, audio tracks and mixing |
| pathway-photography | Photography: a camera, studio lighting and print selection |
| pathway-writing | Writing & Publishing: a notebook, manuscript and finished book |
| pathway-gaming | Gaming & Esports: level design, a controller and a clear goal |
| pathway-cooking | Cooking & Food: prepared ingredients and controlled cooking |
| pathway-skilled-trades | Skilled Trades & DIY: a workbench, tools and project plan |
| pathway-sustainability | Sustainability: a home, reusable bottle and balanced choices |
| pathway-language-learning | Language Learning: reading, listening and conversation |
| pathway-personal-finance | Personal Finance: a budget notebook and savings jars |
| pathway-fitness | Fitness & Training: exercise equipment and consistent planning |

Original 1536 × 1024 PNGs are retained in `originals/`. The app loads 960 × 640
WebP copies from `app/assets/graphics/`, encoded at quality 83 with ImageMagick.
The images are decorative, with empty alt text and adjacent real HTML headings.
Section images load lazily; the opening illustration loads immediately. The existing
build copies the web assets into `dist/app/assets/graphics/`; originals stay outside
the deployment. No third-party asset requests are needed.

Individual pathway pages use dedicated artwork when available and their category illustration
otherwise. All nine technical, five creative and six life-skills pathways have dedicated
illustrations; the other 21 pathways use category art. There are 26 generated images in total, including the catalogue
overview and five category illustrations.
The original three technical images completed during an interrupted generation and were recovered
before generating the remaining two. Batch 3 prompts were saved before resuming generation.
