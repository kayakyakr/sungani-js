# Add the source to the sprocket asset path if this is a rails project

if Rails && Rails.application && Rails.application.config.assets
  base_dir = File.expand_path(File.join(File.dirname(__FILE__), '..'))
  Rails.application.config.assets.append_paths File.join(base_dir, 'src'), File.join(base_dir, 'jslib')
end