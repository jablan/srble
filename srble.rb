# encoding: utf-8

require 'sinatra'
require 'set'

ALL_WORDS = Set.new(IO.readlines("words.txt", chomp: true, encoding: "UTF-8"))
DAILY_WORDS = IO.readlines("daily.txt", chomp: true, encoding: "UTF-8")
KEYBOARD_ROWS = [
  %w[Љ Њ Е Р Т З У И О П Ш Ђ],
  %w[А С Д Ф Г Х Ј К Л Ч Ћ],
  %w[Ж Џ Ц В Б Н М]
]

def daily_word
  DAILY_WORDS.last
end

def check_word(word)
  daily_hash = Hash[daily_word.upcase.chars.each_with_index.map{|c, i|
    [i, c]
  }]
  result = word.chars.each_with_index.map do |c, i|
    if daily_hash[i] == c
      daily_hash.delete(i)
      { letter: c, code: 2 }
    elsif (j, d = daily_hash.find{|k, v| v == c})
      daily_hash.delete(j)
      { letter: c, code: 1 }
    else
      { letter: c, code: 0 }
    end
  end
end

get '/' do
  @keyboard_rows = KEYBOARD_ROWS

  erb :index
end

post '/word' do
  content_type :json

  word = params['q']
  unless ALL_WORDS.include?(word.downcase)
    status 400
    return {error: 'UNKNOWN_WORD'}.to_json
  end
  check_word(word).to_json
end
