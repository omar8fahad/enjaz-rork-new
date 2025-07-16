import { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { useSettingsStore } from '@/store/settingsStore';
import { colors, themeNames, ThemeName } from '@/constants/colors';
import { useColorScheme } from 'react-native';
import { Bell, Database, ArrowUpDown, Calendar, Palette, Clock, Download, Upload, Trash2, ChevronDown, ChevronUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dayThemesExpanded, setDayThemesExpanded] = useState(true);
  const [nightThemesExpanded, setNightThemesExpanded] = useState(true);
  const [accentColorsExpanded, setAccentColorsExpanded] = useState(false);
  
  const { 
    settings, 
    setTheme, 
    setAccentColor, 
    setFontSize, 

    toggleNotifications, 
    setDailyReminderTime,
    requestNotificationPermissions,
    scheduleDailyReminder 
  } = useSettingsStore();
  
  const themeColors = colors[settings.theme as keyof typeof colors] || colors.andalusianMosaic;
  
  // تجميع الهويات البصرية
  const dayThemes = [
    { id: 'andalusianMosaic', name: themeNames.andalusianMosaic },
    { id: 'qiblaLines', name: themeNames.qiblaLines },
    { id: 'palmBreeze', name: themeNames.palmBreeze },
    { id: 'andalusianNights', name: themeNames.andalusianNights },
    { id: 'desertDawn', name: themeNames.desertDawn },
  ];
  
  const nightThemes = [
    { id: 'twilightMagic', name: themeNames.twilightMagic },
    { id: 'moonGlow', name: themeNames.moonGlow },
    { id: 'desertNights', name: themeNames.desertNights },
    { id: 'forestShadows', name: themeNames.forestShadows },
    { id: 'nightWaves', name: themeNames.nightWaves },
  ];
  
  // ألوان التمييز المحدثة مع ألوان من الهويات البصرية
  const accentColors = [
    // الألوان الأساسية
    { name: 'بنفسجي', value: '#6366F1' },
    { name: 'أخضر', value: '#10B981' },
    { name: 'أصفر', value: '#F59E0B' },
    { name: 'أحمر', value: '#EF4444' },
    { name: 'وردي', value: '#EC4899' },
    { name: 'برتقالي', value: '#F97316' },
    { name: 'سماوي', value: '#06B6D4' },
    { name: 'بنفسجي فاتح', value: '#7C3AED' },
    
    // ألوان من الهويات النهارية
    { name: 'أزرق فينيق', value: colors.andalusianMosaic.primary },
    { name: 'فيروزي فاتح', value: colors.andalusianMosaic.secondary },
    { name: 'ذهبي باهت', value: colors.andalusianMosaic.warning },
    { name: 'أخضر مسجدي', value: colors.qiblaLines.primary },
    { name: 'أخضر نعناعي', value: colors.qiblaLines.secondary },
    { name: 'بني رطب', value: colors.palmBreeze.primary },
    { name: 'أخضر نخلي', value: colors.palmBreeze.secondary },
    { name: 'أصفر رطب', value: colors.palmBreeze.warning },
    { name: 'أزرق سمائي', value: colors.andalusianNights.primary },
    { name: 'بنفسجي هادئ', value: colors.andalusianNights.secondary },
    { name: 'برتقالي شروق', value: colors.desertDawn.primary },
    { name: 'وردي شاحب', value: colors.desertDawn.secondary },
    { name: 'بني رملي', value: colors.desertDawn.success },
    
    // ألوان من الهويات الليلية
    { name: 'ليلكي بارد', value: colors.twilightMagic.primary },
    { name: 'رمادي دخاني', value: colors.twilightMagic.secondary },
    { name: 'فضي قمري', value: colors.moonGlow.primary },
    { name: 'أزرق فحمي', value: colors.moonGlow.secondary },
    { name: 'برتقالي غروب', value: colors.desertNights.primary },
    { name: 'ستيل رمادي', value: colors.desertNights.secondary },
    { name: 'أخضر فسفوري', value: colors.forestShadows.primary },
    { name: 'رمادي زيتي', value: colors.forestShadows.secondary },
    { name: 'فيروزي عميق', value: colors.nightWaves.primary },
    { name: 'أزرق بحري', value: colors.nightWaves.secondary },
  ];
  
  const fontSizes = [
    { name: 'صغير', value: 14 },
    { name: 'متوسط', value: 16 },
    { name: 'كبير', value: 18 },
    { name: 'كبير جداً', value: 20 },
  ];
  

  
  const handleExportData = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      const dataObject = allData.reduce((result: Record<string, any>, [key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
        return result;
      }, {});
      
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: dataObject
      };
      
      const dataString = JSON.stringify(exportData, null, 2);
      const fileName = `routine-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      if (Platform.OS === 'web') {
        const blob = new Blob([dataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Alert.alert('تم التصدير بنجاح', 'تم تنزيل ملف النسخة الاحتياطية.');
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, dataString);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'مشاركة النسخة الاحتياطية'
          });
        } else {
          Alert.alert(
            'تم التصدير بنجاح',
            `تم حفظ النسخة الاحتياطية في: ${fileUri}`,
            [{ text: 'موافق' }]
          );
        }
      }
    } catch (error) {
      Alert.alert('فشل التصدير', 'حدث خطأ أثناء تصدير البيانات.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportData = async () => {
    if (isImporting) return;
    
    Alert.alert(
      'استيراد البيانات',
      'سيؤدي هذا إلى استبدال جميع البيانات الحالية. هل تريد المتابعة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'استيراد',
          onPress: async () => {
            setIsImporting(true);
            try {
              if (Platform.OS === 'web') {
                // For web, create a file input
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e: any) => {
                  const file = e.target.files[0];
                  if (file) {
                    const text = await file.text();
                    await processImportData(text);
                  }
                  setIsImporting(false);
                };
                input.click();
              } else {
                const result = await DocumentPicker.getDocumentAsync({
                  type: 'application/json',
                  copyToCacheDirectory: true
                });
                
                if (!result.canceled && result.assets[0]) {
                  const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
                  await processImportData(fileContent);
                }
                setIsImporting(false);
              }
            } catch (error) {
              Alert.alert('فشل الاستيراد', 'حدث خطأ أثناء استيراد البيانات.');
              console.error('Import error:', error);
              setIsImporting(false);
            }
          }
        }
      ]
    );
  };
  
  const processImportData = async (jsonString: string) => {
    try {
      const importData = JSON.parse(jsonString);
      
      // Check if it's a valid backup file
      if (importData.data) {
        // Clear existing data
        await AsyncStorage.clear();
        
        // Import new data
        const entries = Object.entries(importData.data);
        for (const [key, value] of entries) {
          await AsyncStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        }
        
        Alert.alert(
          'تم الاستيراد بنجاح',
          'تم استيراد البيانات بنجاح. يرجى إعادة تشغيل التطبيق لرؤية التغييرات.',
          [{ text: 'موافق' }]
        );
      } else {
        Alert.alert('ملف غير صالح', 'الملف المحدد ليس نسخة احتياطية صالحة.');
      }
    } catch (error) {
      Alert.alert('ملف غير صالح', 'فشل في قراءة ملف النسخة الاحتياطية.');
      console.error('Process import error:', error);
    }
  };
  
  const handleResetData = () => {
    Alert.alert(
      'إعادة تعيين جميع البيانات',
      'تحذير: سيؤدي هذا إلى حذف جميع البيانات نهائياً:\n\n• جميع الروتينات والمهام\n• تقدم تلاوة القرآن\n• بيانات الكتب والقراءة\n• الإعدادات المخصصة\n\nلا يمكن التراجع عن هذا الإجراء!',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نعم، احذف كل شيء',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'تأكيد نهائي',
              'هل أنت متأكد تماماً من رغبتك في حذف جميع البيانات؟',
              [
                { text: 'إلغاء', style: 'cancel' },
                {
                  text: 'نعم، احذف',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await AsyncStorage.clear();
                      Alert.alert(
                        'تم الحذف بنجاح',
                        'تم حذف جميع البيانات. سيتم إعادة تشغيل التطبيق الآن.',
                        [
                          {
                            text: 'موافق',
                            onPress: () => {
                              // In a real app, you might want to restart or navigate to initial screen
                              if (Platform.OS === 'web') {
                                window.location.reload();
                              }
                            }
                          }
                        ]
                      );
                    } catch (error) {
                      Alert.alert('خطأ', 'فشل في إعادة تعيين البيانات.');
                      console.error('Reset error:', error);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };
  
  const getThemePreviewColors = (themeName: string) => {
    const theme = colors[themeName as keyof typeof colors] || colors.andalusianMosaic;
    return [theme.primary, theme.secondary, theme.success];
  };
  
  const renderThemeSection = (themes: any[], title: string, isExpanded: boolean, toggleExpanded: () => void) => (
    <View style={styles.themeSection}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={[styles.subsectionTitleBackground, { backgroundColor: themeColors.card + '60' }]}>
          <StyledText variant="h3" style={styles.subsectionTitle}>
            {title}
          </StyledText>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color={themeColors.subtext} />
        ) : (
          <ChevronDown size={20} color={themeColors.subtext} />
        )}
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.themesGridRTL}>
          {themes.map((theme) => {
            const previewColors = getThemePreviewColors(theme.id);
            
            return (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  { 
                    backgroundColor: themeColors.card, 
                    borderColor: settings.theme === theme.id ? themeColors.primary : themeColors.border,
                    borderWidth: settings.theme === theme.id ? 2 : 1,
                  },
                ]}
                onPress={() => setTheme(theme.id as any)}
                activeOpacity={0.7}
              >
                <View style={styles.themePreview}>
                  {previewColors.map((color, colorIndex) => (
                    <View
                      key={colorIndex}
                      style={[styles.previewColor, { backgroundColor: color }]}
                    />
                  ))}
                </View>
                
                <StyledText variant="caption" numberOfLines={2} style={styles.themeName}>
                  {theme.name}
                </StyledText>
                
                {settings.theme === theme.id && (
                  <View
                    style={[styles.selectedIndicator, { backgroundColor: themeColors.primary }]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <View style={[styles.headerTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
          <StyledText variant="h1">الإعدادات</StyledText>
        </View>
        <StyledText variant="body" color={themeColors.subtext} style={styles.subtitle}>
          تخصيص تجربة التطبيق
        </StyledText>
      </View>
      
      <View style={styles.section}>
        <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
          <StyledText variant="h2" style={styles.sectionTitle}>
            الهوية البصرية
          </StyledText>
        </View>
        
        {renderThemeSection(dayThemes, 'الهويات النهارية', dayThemesExpanded, () => setDayThemesExpanded(!dayThemesExpanded))}
        {renderThemeSection(nightThemes, 'الهويات الليلية', nightThemesExpanded, () => setNightThemesExpanded(!nightThemesExpanded))}
        
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => setAccentColorsExpanded(!accentColorsExpanded)}
          activeOpacity={0.7}
        >
          <View style={[styles.subsectionTitleBackground, { backgroundColor: themeColors.card + '60' }]}>
            <StyledText variant="h3" style={styles.subsectionTitle}>
              لون التمييز
            </StyledText>
          </View>
          {accentColorsExpanded ? (
            <ChevronUp size={20} color={themeColors.subtext} />
          ) : (
            <ChevronDown size={20} color={themeColors.subtext} />
          )}
        </TouchableOpacity>
        
        <View style={styles.colorOptionsRTL}>
          {accentColors.slice(0, accentColorsExpanded ? accentColors.length : 7).map((color) => (
            <TouchableOpacity
              key={color.name}
              style={[
                styles.colorOption,
                { backgroundColor: color.value },
                settings.accentColor === color.value && styles.selectedColorOption,
              ]}
              onPress={() => setAccentColor(color.value)}
            />
          ))}
        </View>
        
        <View style={[styles.subsectionTitleBackground, { backgroundColor: themeColors.card + '60' }]}>
          <StyledText variant="h3" style={styles.subsectionTitle}>
            حجم الخط
          </StyledText>
        </View>
        
        <View style={styles.fontSizeContainer}>
          {fontSizes.map((size) => (
            <TouchableOpacity
              key={size.name}
              style={[
                styles.fontSizeOption,
                {
                  backgroundColor: settings.fontSize === size.value ? themeColors.primary : themeColors.card,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() => setFontSize(size.value)}
              activeOpacity={0.7}
            >
              <StyledText 
                variant="caption" 
                color={settings.fontSize === size.value ? '#FFFFFF' : themeColors.text}
                style={styles.fontSizeText}
              >
                {size.name}
              </StyledText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      

      
      <View style={styles.section}>
        <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
          <StyledText variant="h2" style={styles.sectionTitle}>
            الإشعارات
          </StyledText>
        </View>
        
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Bell size={20} color={themeColors.text} style={styles.settingIcon} />
              <StyledText variant="body">تفعيل الإشعارات</StyledText>
            </View>
            <Switch
              value={settings.notifications.enabled}
              onValueChange={async (value) => {
                if (value) {
                  // Request permissions before enabling
                  const hasPermission = await requestNotificationPermissions();
                  if (hasPermission) {
                    toggleNotifications(value);
                  } else {
                    Alert.alert(
                      'الإذن مطلوب',
                      'يجب السماح بالإشعارات لتفعيل التذكيرات اليومية. يرجى الذهاب إلى إعدادات الجهاز والسماح بالإشعارات.',
                      [{ text: 'موافق' }]
                    );
                  }
                } else {
                  toggleNotifications(value);
                }
              }}
              trackColor={{ false: themeColors.border, true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowTimePicker(true)}
            disabled={!settings.notifications.enabled}
          >
            <View style={styles.settingLabelContainer}>
              <Clock size={20} color={settings.notifications.enabled ? themeColors.text : themeColors.subtext} style={styles.settingIcon} />
              <StyledText 
                variant="body" 
                color={settings.notifications.enabled ? themeColors.text : themeColors.subtext}
              >
                وقت التذكير اليومي
              </StyledText>
            </View>
            <View style={styles.settingValue}>
              <StyledText 
                variant="body" 
                color={settings.notifications.enabled ? themeColors.primary : themeColors.subtext}
              >
                {settings.notifications.dailyReminderTime}
              </StyledText>
            </View>
          </TouchableOpacity>
          
          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${settings.notifications.dailyReminderTime}:00`)}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  const hours = selectedTime.getHours().toString().padStart(2, '0');
                  const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                  setDailyReminderTime(`${hours}:${minutes}`);
                }
              }}
            />
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={[styles.sectionTitleBackground, { backgroundColor: themeColors.card + '80' }]}>
          <StyledText variant="h2" style={styles.sectionTitle}>
            إدارة البيانات
          </StyledText>
        </View>
        
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <TouchableOpacity 
            style={[styles.settingItem, isExporting && styles.disabledItem]} 
            onPress={handleExportData}
            disabled={isExporting}
          >
            <View style={styles.settingLabelContainer}>
              <Download size={20} color={isExporting ? themeColors.subtext : themeColors.text} style={styles.settingIcon} />
              <View>
                <StyledText variant="body" color={isExporting ? themeColors.subtext : themeColors.text}>
                  تصدير البيانات
                </StyledText>
                <StyledText variant="caption" color={themeColors.subtext}>
                  إنشاء نسخة احتياطية من جميع البيانات
                </StyledText>
              </View>
            </View>
            {isExporting && (
              <StyledText variant="caption" color={themeColors.primary}>
                جاري التصدير...
              </StyledText>
            )}
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <TouchableOpacity 
            style={[styles.settingItem, isImporting && styles.disabledItem]} 
            onPress={handleImportData}
            disabled={isImporting}
          >
            <View style={styles.settingLabelContainer}>
              <Upload size={20} color={isImporting ? themeColors.subtext : themeColors.text} style={styles.settingIcon} />
              <View>
                <StyledText variant="body" color={isImporting ? themeColors.subtext : themeColors.text}>
                  استيراد البيانات
                </StyledText>
                <StyledText variant="caption" color={themeColors.subtext}>
                  استعادة البيانات من نسخة احتياطية
                </StyledText>
              </View>
            </View>
            {isImporting && (
              <StyledText variant="caption" color={themeColors.primary}>
                جاري الاستيراد...
              </StyledText>
            )}
          </TouchableOpacity>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
            <View style={styles.settingLabelContainer}>
              <Trash2 size={20} color="#EF4444" style={styles.settingIcon} />
              <View>
                <StyledText variant="body" color="#EF4444">
                  إعادة تعيين جميع البيانات
                </StyledText>
                <StyledText variant="caption" color={themeColors.subtext}>
                  حذف جميع البيانات نهائياً
                </StyledText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <StyledText variant="caption" color={themeColors.subtext} centered>
          متتبع الروتين اليومي الإصدار 1.0.0
        </StyledText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'right',
  },
  subsectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'right',
  },
  themeSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themesGridRTL: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  themeCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  themePreview: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  previewColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  colorOptionsRTL: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 2,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitleBackground: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  sectionTitleBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  subsectionTitleBackground: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  disabledItem: {
    opacity: 0.6,
  },
});