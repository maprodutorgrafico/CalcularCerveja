[app]
title = Calculadora Cerveja
package.name = cervejacalc
package.domain = com.seudominio
version = 0.1
requirements = python3,kivy==2.3.0
source.include_exts = py,png,jpg,kv,atlas,json  # ✅ 确保JSON被打包
android.permissions = INTERNET
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 25b
android.gradle_dependencies = 'androidx.appcompat:appcompat:1.5.0'
android.add_src = yes

[buildozer]
log_level = 2
warn_on_root = 1
