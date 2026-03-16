Gem::Specification.new do |s|
  s.name        = "tina4-css"
  s.version     = "2.0.0"
  s.summary     = "Lightweight responsive CSS framework (~24KB minified)"
  s.description = "A lightweight, responsive CSS framework with grid, buttons, forms, cards, nav, modals, alerts, tables, badges, and utilities. Part of the Tina4 ecosystem."
  s.authors     = ["Tina4 Stack"]
  s.email       = "info@tina4.com"
  s.homepage    = "https://tina4.com"
  s.license     = "MIT"

  s.files       = Dir["dist/**/*", "src/scss/**/*", "README.md", "LICENSE"]
  s.metadata    = {
    "source_code_uri" => "https://github.com/tina4stack/tina4-css",
    "documentation_uri" => "https://tina4.com"
  }
end
