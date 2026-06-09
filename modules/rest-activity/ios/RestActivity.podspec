Pod::Spec.new do |s|
  s.name           = 'RestActivity'
  s.version        = '1.0.0'
  s.summary        = 'Rest timer Live Activity bridge'
  s.description    = 'Starts/ends an ActivityKit Live Activity for the rest timer.'
  s.author         = ''
  s.homepage       = 'https://github.com/flexapp/rest-activity'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
